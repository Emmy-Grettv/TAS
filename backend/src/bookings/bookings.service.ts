import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto, RejectBookingDto } from './dto/booking.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
    private whatsappService: WhatsappService,
    private configService: ConfigService,
  ) {}

  private buildQuery(query: BookingQueryDto): SelectQueryBuilder<Booking> {
    const qb = this.bookingsRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.createdBy', 'createdBy')
      .orderBy('booking.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere(
        `(booking.schoolName ILIKE :search OR booking.contactPerson ILIKE :search OR booking.districtArea ILIKE :search)`,
        { search: `%${query.search}%` },
      );
    }
    if (query.districtArea) {
      qb.andWhere('booking.districtArea ILIKE :district', { district: `%${query.districtArea}%` });
    }
    if (query.contactPerson) {
      qb.andWhere('booking.contactPerson ILIKE :contact', { contact: `%${query.contactPerson}%` });
    }
    if (query.schoolName) {
      qb.andWhere('booking.schoolName ILIKE :school', { school: `%${query.schoolName}%` });
    }
    if (query.status) {
      qb.andWhere('booking.status = :status', { status: query.status });
    }
    if (query.createdById) {
      qb.andWhere('createdBy.id = :userId', { userId: query.createdById });
    }
    if (query.dateOfVisit) {
      qb.andWhere('booking.dateOfVisit = :date', { date: query.dateOfVisit });
    }
    return qb;
  }

  async findAll(query: BookingQueryDto): Promise<Booking[]> {
    return this.buildQuery(query).getMany();
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.bookingsRepo.count(),
      this.bookingsRepo.count({ where: { status: BookingStatus.PENDING } }),
      this.bookingsRepo.count({ where: { status: BookingStatus.APPROVED } }),
      this.bookingsRepo.count({ where: { status: BookingStatus.REJECTED } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepo.findOne({ where: { id }, relations: ['createdBy'] });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async create(dto: CreateBookingDto, userId: string | null): Promise<Booking> {
    const booking = this.bookingsRepo.create({
      ...dto,
      ...(userId ? { createdBy: { id: userId } as any } : {}),
    });
    return this.bookingsRepo.save(booking);
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    return this.bookingsRepo.save(booking);
  }

  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.findOne(id);
    await this.bookingsRepo.remove(booking);
    return { message: 'Booking deleted successfully' };
  }

  async approve(id: string): Promise<{ message: string; pdfUrl: string }> {
    const booking = await this.findOne(id);
    if (booking.status === BookingStatus.APPROVED) {
      throw new Error('Booking is already approved');
    }

    // Generate PDF
    const pdfFileName = `Reservation_${booking.id.split('-')[0]}.pdf`;
    const pdfDir = path.join(__dirname, '..', '..', 'uploads', 'bookings');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, pdfFileName);

    await this.generateReservationPdf(booking, pdfPath);

    // Update Status
    booking.status = BookingStatus.APPROVED;
    await this.bookingsRepo.save(booking);

    // Send WhatsApp Message
    let publicUrl = this.configService.get<string>('PUBLIC_APP_URL', '');
    if (!publicUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
      publicUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    }
    if (!publicUrl) publicUrl = 'http://localhost:3001';
    if (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
      publicUrl = `https://${publicUrl}`;
    }
    publicUrl = publicUrl.replace(/\/+$/, '');

    const pdfUrl = `${publicUrl}/uploads/bookings/${pdfFileName}`;

    const message = `Good day ${booking.contactPerson},

Your reservation at Tegano Recreation Center has been approved.

Please find attached your reservation confirmation letter.

We look forward to welcoming your learners.

Kind regards,
Tegano Recreation Center`;

    // Note: We need to update WhatsappService to accept a generic mediaUrl
    try {
      await this.whatsappService.sendMessage(booking.telephone, message, false, [pdfUrl]);
    } catch (e) {
      this.logger.error('Failed to send WhatsApp message', e);
    }

    return { message: 'Booking approved successfully', pdfUrl };
  }

  async reject(id: string, dto: RejectBookingDto): Promise<{ message: string }> {
    const booking = await this.findOne(id);

    booking.status = BookingStatus.REJECTED;
    booking.rejectionReason = dto.rejectionReason;
    await this.bookingsRepo.save(booking);

    const message = `Good day ${booking.contactPerson},

We regret to inform you that your reservation request for Tegano Recreation Center has not been approved.

Reason:
${dto.rejectionReason}

For further assistance, please contact us.

Kind regards,
Tegano Recreation Center`;

    try {
      await this.whatsappService.sendMessage(booking.telephone, message, false);
    } catch (e) {
      this.logger.error('Failed to send WhatsApp message', e);
    }

    return { message: 'Booking rejected successfully' };
  }

  private getAssetPath(filename: string): string | null {
    const candidates = [
      path.join(__dirname, '..', 'assets', filename),
      path.join(__dirname, '..', '..', 'assets', filename),
      path.join(process.cwd(), 'assets', filename),
      path.join(process.cwd(), 'src', 'assets', filename),
      path.join(process.cwd(), 'dist', 'assets', filename),
      path.join(process.cwd(), '..', 'frontend', 'public', 'images', filename),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  /**
   * Collects up to 6 activity photos for the Annexure 1 grid.
   * Tries the preferred `activityN.*` naming first, then falls back to
   * legacy filenames that may already exist in the assets folder, and
   * finally falls back to the flyer image so the grid is never empty.
   */
  private getActivityImagePaths(maxImages = 6): string[] {
    const found: string[] = [];
    const exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

    for (let i = 1; i <= maxImages; i++) {
      for (const ext of exts) {
        const p = this.getAssetPath(`activity${i}.${ext}`);
        if (p) {
          found.push(p);
          break;
        }
      }
    }

    if (found.length < maxImages) {
      const legacyNames = [
        'IMG_4256.JPG',
        'IMG_4257.JPG',
        'IMG_4258.JPG',
        'IMG_4259.JPG',
        'IMG-20260714-WA0005.jpg',
        'IMG-20260714-WA0006.jpg',
        'IMG-20260714-WA0007.jpg',
        'IMG-20260714-WA0008.jpg',
      ];
      for (const name of legacyNames) {
        if (found.length >= maxImages) break;
        const p = this.getAssetPath(name);
        if (p && !found.includes(p)) found.push(p);
      }
    }

    if (found.length === 0) {
      const flyer = this.getAssetPath('flyer.jpg');
      if (flyer) found.push(flyer);
    }

    // Pad up to maxImages by reusing what we have, so the grid layout
    // (fixed slot positions) is identical on every generated PDF instead
    // of reflowing differently depending on how many assets exist.
    if (found.length > 0) {
      let i = 0;
      while (found.length < maxImages) {
        found.push(found[i % found.length]);
        i++;
      }
    }

    return found.slice(0, maxImages);
  }

  private async generateReservationPdf(booking: Booking, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 0, left: 50, right: 50 },
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const pageWidth = 495; // content width: A4 (595.28pt) minus 50pt margins on each side
      const pageHeight = doc.page.height;

      // Shared footer — identical on both pages: tagline, then the two
      // contact lines, all pinned to the same fixed offsets from the
      // bottom of the page so page 1 and page 2 always match exactly.
      const drawFooter = () => {
        doc.fillColor('#0066cc').font('Helvetica-BoldOblique').fontSize(9)
           .text('"Where Kids Experience Fun, Adventure, and Learning"', 50, pageHeight - 80, { align: 'center', width: pageWidth, lineBreak: false });
        doc.fillColor('black').font('Helvetica-Bold').fontSize(8.5)
           .text('"Follow us: Facebook | Instagram | TikTok"', 50, pageHeight - 65, { align: 'center', width: pageWidth, lineBreak: false });
        doc.font('Helvetica')
           .text('DIRECT ALL INQUIRES TO: +263 781499656 / 784700878', 50, pageHeight - 50, { align: 'center', width: pageWidth, lineBreak: false });
      };

      // Shared header — identical on both pages: logo, company block on the
      // right, and the horizontal divider rule underneath it that separates
      // the letterhead from the body content. The divider is positioned
      // below the full logo image (including the "Recreation Center" text
      // that's baked into that image) rather than a fixed guess, so it
      // never cuts through the logo regardless of the asset's proportions.
      const logoPath = this.getAssetPath('logo.png');
      const logoTop = 45;
      const logoWidth = 120;
      let logoDisplayHeight = 90; // sane fallback if dimensions can't be read
      if (logoPath) {
        try {
          const logoImage = (doc as any).openImage(logoPath);
          logoDisplayHeight = logoWidth * (logoImage.height / logoImage.width);
        } catch (e) {
          this.logger.warn(`Failed to read logo dimensions: ${e.message}`);
        }
      }
      const companyBlockBottom = 95; // bottom of the 4-line company address block
      const dividerY = Math.max(logoTop + logoDisplayHeight, companyBlockBottom) + 10;
      const reservationDateY = dividerY + 14;
      const toY = reservationDateY + 20;

      const drawHeader = () => {
        if (logoPath) {
          doc.image(logoPath, 50, logoTop, { width: logoWidth });
        }

        doc.font('Helvetica-Bold').fontSize(10).fillColor('#0066cc')
           .text('TEGANO INVESTMENT (PVT) LTD', 300, 50, { align: 'right', width: 240 })
           .font('Helvetica')
           .text('26 Princess Drive, Newlands, Harare', { align: 'right', width: 240 })
           .text('Tel: +263 781499656 / 784700878', { align: 'right', width: 240 })
           .text('Email: teganoinvestmentpvtltd@gmail.com', { align: 'right', width: 240 });

        // Double divider rule under the letterhead (thin top line + thick bottom line)
        doc.moveTo(50, dividerY).lineTo(50 + pageWidth, dividerY)
           .lineWidth(0.75).strokeColor('black').stroke();
        doc.moveTo(50, dividerY + 3).lineTo(50 + pageWidth, dividerY + 3)
           .lineWidth(2.5).strokeColor('black').stroke();

        doc.fillColor('black').fontSize(9.5);
      };

      // --- Page 1: Letter ---
      drawHeader();

      const reservationDate = new Date().toLocaleDateString('en-GB');
      doc.fontSize(9).text(`Reservation Date: ${reservationDate}`, 50, reservationDateY, { align: 'right', width: pageWidth });

      doc.font('Helvetica-Bold').fontSize(9.5).text(`To: ${booking.schoolName}`, 50, toY, { align: 'left' });
      doc.font('Helvetica').fontSize(9);
      if (booking.poBox) doc.text(`PO Box: ${booking.poBox}`);
      doc.text(booking.districtArea);

      doc.moveDown(0.6);
      doc.font('Helvetica-Bold').fontSize(10).text('Re: Reservation Confirmation – School Trip Visit');
      doc.font('Helvetica').fontSize(9).moveDown(0.4);

      doc.text(`Dear ${booking.contactPerson},`);
      doc.moveDown(0.4);

      doc.text('We are pleased to confirm the reservation for your upcoming school trip to Tegano Recreation Center. We are excited to host your students and provide a fun, engaging, and safe recreational experience.');
      doc.moveDown(0.4);

      doc.text('Please find the details of your reservation below:');
      doc.moveDown(0.3);

      doc.font('Helvetica-Bold').fontSize(9).list([
        `School Name: ${booking.schoolName}`,
        `Date of Visit: ${new Date(booking.dateOfVisit).toLocaleDateString('en-GB')}`,
        `Arrival Time: ${booking.arrivalTime || '09:00 AM'} - Departure Time: ${booking.departureTime || '15:00 PM'}`,
        `Entrance fee and Meals: ${booking.entrance}`,
        `Number of Students: ${booking.studentsCount} Kids`,
        `Number of Teachers/Chaperones: ${booking.teachersCount || 'N/S'}`,
        `Reservation Reference: TGN/${booking.id.slice(0, 5).toUpperCase()}/${new Date().getFullYear()}`,
      ], { bulletRadius: 2, textIndent: 6, lineGap: 0 });

      doc.moveDown(0.4);

      doc.fillColor('black').font('Helvetica').fontSize(9);
      doc.text('Our recreation center provides a safe and exciting environment where students can enjoy a variety of recreational activities designed to encourage physical activity, teamwork, and fun learning experiences.');
      doc.moveDown(0.3);
      doc.text('A detailed list of activities available during the visit is provided in Annexure 1 attached to this letter.');

      doc.moveDown(0.4);
      doc.font('Helvetica-Bold').fontSize(9).text('Important Information:');
      doc.font('Helvetica').fontSize(8.5);
      doc.list([
        'Students should wear comfortable clothing suitable for play activities.',
        'For water activities, students should bring extra clothes and towels.',
        'Teachers and supervisors are requested to accompany and monitor their groups.'
      ], { bulletRadius: 2, textIndent: 6, lineGap: 0 });

      doc.moveDown(0.4);
      doc.text('We look forward to welcoming your students for an enjoyable and memorable day at Tegano Recreation Center.');

      doc.moveDown(0.4);
      doc.text('Yours sincerely,');

      const signaturePath = this.getAssetPath('signature.png') || this.getAssetPath('signature.jpg');
      if (signaturePath) {
        const graphicY = doc.y + 2;
        try {
          doc.image(signaturePath, 50, graphicY, { width: 160 });
        } catch (e) {
          this.logger.warn(`Failed to render signature image: ${e.message}`);
        }
        doc.x = 50;
        doc.y = graphicY + 70;
      } else {
        doc.moveDown(0.4);
      }

      doc.font('Helvetica-Bold').fontSize(9).text('Emmerson Chitawa');
      doc.moveDown(0.2);
      doc.font('Helvetica').fontSize(8.5).text('Facility Supervisor');

      drawFooter();

      // --- Page 2: Annexure 1 (strictly exactly 2 pages) ---
      doc.addPage({
        size: 'A4',
        margins: { top: 40, bottom: 0, left: 50, right: 50 },
      });
      drawHeader();

      doc.font('Helvetica-Bold').fontSize(10).text('ANNEXURE 1', 50, toY, { align: 'left' });
      doc.fontSize(9.5).text('School Trip Activities – Tegano Recreation Center');
      doc.font('Helvetica').fontSize(8.5).moveDown(0.3);
      doc.text('During the visit, students will have access to the following supervised recreational activities designed to provide fun, physical exercise, and social interaction in a safe environment:', { width: pageWidth });
      doc.moveDown(0.3);

      doc.fontSize(8);
      const activities = [
        { name: '1. Electric Go-Kart Racing', desc: 'Students drive mini electric go-karts on a safe track.' },
        { name: '2. Mini Electric Car & Motorcycle Rides', desc: 'Children ride battery-powered cars in a supervised area.' },
        { name: '3. Carousel Rotating Ride', desc: 'A gentle rotating ride with colorful vehicles.' },
        { name: '4. Inflatable Bouncy Castles', desc: 'Large inflatable castles where children can jump safely.' },
        { name: '5. Inflatable Adventure Play Structures', desc: 'Inflatable play zones with climbing, sliding.' },
        { name: '6. Water Splash Pool Play', desc: 'A shallow splash pool where children can enjoy safe water play.' },
        { name: '7. Inflatable Water Slides', desc: 'Inflatable slides allowing children to slide into the splash pool.' },
        { name: '8. Inflatable Water Climbing Wall', desc: 'A soft inflatable climbing wall.' },
        { name: '9. Trampoline Jumping', desc: 'A trampoline area where children can jump safely.' },
        { name: '10. Interactive Driving Games', desc: 'Ride-on vehicles with steering.' },
        { name: '11. Outdoor Free Play Area', desc: 'A spacious outdoor environment for relaxation.' },
        { name: '12. Swings and Balancing', desc: 'Playground swings and balancing equipment.' }
      ];
      let currentY = doc.y;
      activities.forEach(item => {
        doc.font('Helvetica-Bold').fillColor('black').text(item.name, 50, currentY, { continued: true });
        doc.font('Helvetica').fillColor('black').text(` – ${item.desc}`, { width: pageWidth });
        currentY = doc.y + 0.5;
      });
      doc.y = currentY;

      doc.fontSize(9).moveDown(0.4);
      doc.font('Helvetica-Bold').text('Sample Pictures of Activities:');
      doc.moveDown(0.3);

      // --- Photo grid: sized to always fit on this page ---
      const imageY = doc.y;
      const images = this.getActivityImagePaths(6);

      const footerBlockHeight = 40;
      const safetyNoteHeight = 24;
      const spacingBeforeNote = 8;
      const spacingBeforeFooter = 6;
      const reservedBottom = footerBlockHeight + safetyNoteHeight + spacingBeforeNote + spacingBeforeFooter;

      const bottomLimit = pageHeight - 50 - reservedBottom;
      const availableHeight = Math.max(bottomLimit - imageY, 50);

      const drawBox = (imgPath: string, x: number, y: number, w: number, h: number, idx: number) => {
        try {
          doc.save();
          doc.rect(x, y, w, h).clip();
          doc.image(imgPath, x, y, { cover: [w, h], align: 'center', valign: 'center' });
          doc.restore();
        } catch (e) {
          this.logger.warn(`Failed to render activity image ${idx + 1}: ${e.message}`);
        }
      };

      if (images.length >= 5) {
        const boxGap = 6;
        const rowHeight = Math.min(85, Math.max(50, (availableHeight - boxGap) / 2));
        const leftWidth = 220;
        const rightX = 50 + leftWidth + boxGap;
        const rightCellWidth = (pageWidth - leftWidth - boxGap - boxGap) / 2;

        const row0Y = imageY;
        const row1Y = imageY + rowHeight + boxGap;

        // Left column: 2 stacked images
        drawBox(images[0], 50, row0Y, leftWidth, rowHeight, 0);
        drawBox(images[1], 50, row1Y, leftWidth, rowHeight, 1);

        // Right side: 2x2 grid
        drawBox(images[2], rightX, row0Y, rightCellWidth, rowHeight, 2);
        drawBox(images[3], rightX + rightCellWidth + boxGap, row0Y, rightCellWidth, rowHeight, 3);
        drawBox(images[4], rightX, row1Y, rightCellWidth, rowHeight, 4);
        if (images[5]) {
          drawBox(images[5], rightX + rightCellWidth + boxGap, row1Y, rightCellWidth, rowHeight, 5);
        }

        doc.x = 50;
        doc.y = row1Y + rowHeight + spacingBeforeNote;
      } else if (images.length > 0) {
        const columns = images.length > 2 ? 3 : images.length;
        const rows = Math.max(1, Math.ceil(images.length / columns));
        const boxGap = 8;
        const boxWidth = (pageWidth - (columns - 1) * boxGap) / columns;
        const boxHeight = Math.min(85, Math.max(50, (availableHeight - (rows - 1) * boxGap) / rows));

        images.forEach((imgPath, idx) => {
          const col = idx % columns;
          const row = Math.floor(idx / columns);
          const x = 50 + col * (boxWidth + boxGap);
          const y = imageY + row * (boxHeight + boxGap);
          drawBox(imgPath, x, y, boxWidth, boxHeight, idx);
        });

        doc.x = 50;
        doc.y = imageY + rows * boxHeight + (rows - 1) * boxGap + spacingBeforeNote;
      } else {
        doc.x = 50;
        doc.y = imageY + spacingBeforeNote;
      }

      doc.font('Helvetica-Bold')
         .fillColor('#0066cc')
         .fontSize(8.5)
         .text('All activities are conducted under the supervision of trained staff to ensure the safety and enjoyment of all participants.', 50, doc.y, { align: 'center', width: pageWidth });

      drawFooter();

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }
}