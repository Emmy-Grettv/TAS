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

  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = this.bookingsRepo.create({
      ...dto,
      createdBy: { id: userId } as any,
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
    const pdfPath = path.join(__dirname, '..', '..', 'uploads', 'bookings', pdfFileName);
    
    await this.generateReservationPdf(booking, pdfPath);

    // Update Status
    booking.status = BookingStatus.APPROVED;
    await this.bookingsRepo.save(booking);

    // Send WhatsApp Message
    const publicUrl = this.configService.get<string>('PUBLIC_APP_URL', 'http://localhost:3001');
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

  private async generateReservationPdf(booking: Booking, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // --- Page 1: Letter ---
      // We'll leave space for the logo at the top left (x=50, y=50)
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0066cc')
         .text('TEGANO INVESTMENT (PVT) LTD', 300, 50, { align: 'right', width: 240 })
         .font('Helvetica')
         .text('26 Princess Drive, Newlands, Harare', { align: 'right', width: 240 })
         .text('Tel: +263 781499656 / 784700878', { align: 'right', width: 240 })
         .text('Email: teganoinvestmentpvtltd@gmail.com', { align: 'right', width: 240 });
         
      doc.fillColor('black').fontSize(9.5);
      
      const reservationDate = new Date().toLocaleDateString('en-GB');
      doc.text(`Reservation Date: ${reservationDate}`, 50, 130, { align: 'right', width: 495 });
      
      doc.font('Helvetica-Bold').text(`To: ${booking.schoolName}`, 50, 150, { align: 'left' });
      doc.font('Helvetica');
      if (booking.poBox) doc.text(`PO Box: ${booking.poBox}`);
      doc.text(booking.districtArea);
      
      doc.moveDown(1.5);
      doc.font('Helvetica-Bold').text('Re: Reservation Confirmation – School Trip Visit');
      doc.font('Helvetica').moveDown(1);
      
      doc.text(`Dear ${booking.contactPerson},`);
      doc.moveDown(1);
      
      doc.text('We are pleased to confirm the reservation for your upcoming school trip to Tegano Recreation Center. We are excited to host your students and provide a fun, engaging, and safe recreational experience.');
      doc.moveDown(1);
      
      doc.text('Please find the details of your reservation below:');
      doc.moveDown(0.5);
      
      doc.font('Helvetica-Bold').fontSize(9.5).list([
        `School Name: ${booking.schoolName}`,
        `Date of Visit: ${new Date(booking.dateOfVisit).toLocaleDateString('en-GB')}`,
        `Arrival Time: ${booking.arrivalTime || '09:00 AM'} - Departure Time: ${booking.departureTime || '15:00 PM'}`,
        `Entrance fee and Meals: ${booking.entrance}`,
        `Number of Students: ${booking.studentsCount} Kids`,
        `Number of Teachers/Chaperones: ${booking.teachersCount || 'N/S'}`,
        `Reservation Reference: TGN/${booking.id.slice(0, 5).toUpperCase()}/${new Date().getFullYear()}`,
      ], { bulletRadius: 2, textIndent: 8, lineGap: 1 });

      doc.moveDown(0.5);;
      
      doc.fillColor('black').font('Helvetica').moveDown(0.8);
      doc.text('Our recreation center provides a safe and exciting environment where students can enjoy a variety of recreational activities designed to encourage physical activity, teamwork, and fun learning experiences.');
      doc.moveDown(0.5);
      doc.text('A detailed list of activities available during the visit is provided in Annexure 1 attached to this letter.');
      
      doc.moveDown(0.8);
      doc.font('Helvetica-Bold').text('Important Information:');
      doc.font('Helvetica');
      doc.list([
        'Students should wear comfortable clothing suitable for play activities.',
        'For water activities, students should bring extra clothes and towels.',
        'Teachers and supervisors are requested to accompany and monitor their groups.'
      ], { bulletRadius: 2, textIndent: 8 });
      
      doc.moveDown(0.8);
      doc.text('We look forward to welcoming your students for an enjoyable and memorable day at Tegano Recreation Center.');
      
      doc.moveDown(0.8);
      doc.text('Yours sincerely,');
      doc.moveDown(0.6);
      doc.font('Helvetica-Bold').text('Emmerson Chitawa');
      doc.moveDown(0.6);
      doc.font('Helvetica').text('Facility Supervisor');
      
      // Footer
      const pageHeight = doc.page.height;
      doc.font('Helvetica-Bold').fontSize(8.5).text('"Follow us: Facebook | Instagram | TikTok"', 50, pageHeight - 65, { align: 'center', width: 495 });
      doc.font('Helvetica').text('DIRECT ALL INQUIRES TO: +263 781499656 / 784700878', 50, pageHeight - 50, { align: 'center', width: 495 });
      
      // --- Page 2: Annexure 1 ---
      doc.addPage();
      
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0066cc')
         .text('TEGANO INVESTMENT (PVT) LTD', 300, 50, { align: 'right', width: 240 })
         .font('Helvetica')
         .text('26 Princess Drive, Newlands, Harare', { align: 'right', width: 240 })
         .text('Tel: +263 781499656 / 784700878', { align: 'right', width: 240 })
         .text('Email: teganoinvestmentpvtltd@gmail.com', { align: 'right', width: 240 });
         
      doc.fillColor('black').fontSize(9.5);
      doc.font('Helvetica-Bold').text('ANNEXURE 1', 50, 130, { align: 'left' });
      doc.text('School Trip Activities – Tegano Recreation Center');
      doc.font('Helvetica').moveDown(0.5);
      doc.text('During the visit, students will have access to the following supervised recreational activities designed to provide fun, physical exercise, and social interaction in a safe environment:', { width: 495 });
      doc.moveDown(0.5);
      
      doc.fontSize(9);
      const activities = [
        '1. Electric Go-Kart Racing – Students drive mini electric go-karts on a safe track.',
        '2. Mini Electric Car & Motorcycle Rides – Children ride battery-powered cars in a supervised area.',
        '3. Carousel Rotating Ride – A gentle rotating ride with colorful vehicles.',
        '4. Inflatable Bouncy Castles – Large inflatable castles where children can jump safely.',
        '5. Inflatable Adventure Play Structures – Inflatable play zones with climbing, sliding.',
        '6. Water Splash Pool Play – A shallow splash pool where children can enjoy safe water play.',
        '7. Inflatable Water Slides – Inflatable slides allowing children to slide into the splash pool.',
        '8. Inflatable Water Climbing Wall – A soft inflatable climbing wall.',
        '9. Trampoline Jumping – A trampoline area where children can jump safely.',
        '10. Interactive Driving Games – Ride-on vehicles with steering.',
        '11. Outdoor Free Play Area – A spacious outdoor environment for relaxation.',
        '12. Swings and Balancing – Playground swings and balancing equipment.'
      ];
      let currentY = doc.y;
      activities.forEach(item => {
        doc.text(item, 50, currentY, { width: 495 });
        currentY = doc.y + 1;
      });
      doc.y = currentY;
      
      doc.fontSize(9.5).moveDown(1);
      doc.font('Helvetica-Bold').text('Sample Pictures of Activities:');
      doc.moveDown(0.5);
      
      const imageY = doc.y;

      doc.rect(50, imageY, 230, 120)
         .fillAndStroke('#f8fafc', '#cbd5e1');
      doc.fillColor('#475569')
         .font('Helvetica-Bold')
         .text('[ Place Image here ]', 50, imageY + 50, { width: 230, align: 'center' });

      doc.rect(315, imageY, 230, 120)
         .fillAndStroke('#f8fafc', '#cbd5e1');
      doc.fillColor('#475569')
         .text('[ Place Image here ]', 315, imageY + 50, { width: 230, align: 'center' });

      doc.x = 50;
      doc.y = imageY + 135;
      
      doc.font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text('All activities are conducted under the supervision of trained staff to ensure the safety and enjoyment of all participants.', { align: 'center', width: 495 });
      
      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }
}
