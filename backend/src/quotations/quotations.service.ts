import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { CreateQuotationDto, UpdateQuotationDto, QuotationQueryDto } from './dto/quotation.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuotationsService {
  private readonly logger = new Logger(QuotationsService.name);

  constructor(
    @InjectRepository(Quotation)
    private quotationsRepo: Repository<Quotation>,
    private whatsappService: WhatsappService,
    private configService: ConfigService,
  ) {}

  private buildQuery(query: QuotationQueryDto): SelectQueryBuilder<Quotation> {
    const qb = this.quotationsRepo
      .createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.createdBy', 'createdBy')
      .orderBy('quotation.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere(
        `(quotation.schoolName ILIKE :search OR quotation.contactPerson ILIKE :search OR quotation.districtArea ILIKE :search OR quotation.subject ILIKE :search)`,
        { search: `%${query.search}%` },
      );
    }
    if (query.districtArea) {
      qb.andWhere('quotation.districtArea ILIKE :district', { district: `%${query.districtArea}%` });
    }
    if (query.contactPerson) {
      qb.andWhere('quotation.contactPerson ILIKE :contact', { contact: `%${query.contactPerson}%` });
    }
    if (query.schoolName) {
      qb.andWhere('quotation.schoolName ILIKE :school', { school: `%${query.schoolName}%` });
    }
    if (query.createdById) {
      qb.andWhere('createdBy.id = :userId', { userId: query.createdById });
    }
    return qb;
  }

  async findAll(query: QuotationQueryDto): Promise<Quotation[]> {
    return this.buildQuery(query).getMany();
  }

  async getStats() {
    const [total, sent] = await Promise.all([
      this.quotationsRepo.count(),
      this.quotationsRepo.count({ where: { status: 'Sent' } }),
    ]);

    return {
      total,
      sent,
    };
  }

  async findOne(id: string): Promise<Quotation> {
    const quotation = await this.quotationsRepo.findOne({ where: { id }, relations: ['createdBy'] });
    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
  }

  async create(dto: CreateQuotationDto, userId: string): Promise<Quotation> {
    const quotation = this.quotationsRepo.create({
      ...dto,
      createdBy: { id: userId } as any,
    });
    const saved = await this.quotationsRepo.save(quotation);

    // Auto-generate PDF and send via WhatsApp on creation
    try {
      const pdfFileName = `Quotation_${saved.id.split('-')[0]}.pdf`;
      const pdfDir = path.join(__dirname, '..', '..', 'uploads', 'quotations');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }
      const pdfPath = path.join(pdfDir, pdfFileName);

      await this.generateQuotationPdf(saved, pdfPath);
      saved.documentPath = pdfFileName;

      let publicUrl = this.configService.get<string>('PUBLIC_APP_URL', '');
      if (!publicUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
        publicUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
      }
      if (!publicUrl) publicUrl = 'http://localhost:3001';
      if (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
        publicUrl = `https://${publicUrl}`;
      }
      publicUrl = publicUrl.replace(/\/+$/, '');

      const docUrl = `${publicUrl}/uploads/quotations/${pdfFileName}`;

      const message = `Good day ${saved.contactPerson},

Please find attached the quotation for your upcoming school trip to Tegano Recreation Center.

For any questions or clarifications, kindly contact us.

Kind regards,
Tegano Recreation Center`;

      await this.whatsappService.sendMessage(saved.telephone, message, false, [docUrl]);
      saved.status = 'Sent';
      await this.quotationsRepo.save(saved);
      this.logger.log(`Quotation ${saved.id} auto-sent to ${saved.telephone}`);
    } catch (e) {
      this.logger.error('Failed to auto-send quotation PDF', e);
      // Don't throw — quotation is still saved
    }

    return saved;
  }

  async update(id: string, dto: UpdateQuotationDto, filePath?: string): Promise<Quotation> {
    const quotation = await this.findOne(id);
    Object.assign(quotation, dto);
    if (filePath) {
      quotation.documentPath = filePath;
    }
    return this.quotationsRepo.save(quotation);
  }

  async remove(id: string): Promise<{ message: string }> {
    const quotation = await this.findOne(id);
    await this.quotationsRepo.remove(quotation);
    return { message: 'Quotation deleted successfully' };
  }

  async sendQuotation(id: string): Promise<{ message: string }> {
    const quotation = await this.findOne(id);
    
    // Generate PDF
    const pdfFileName = `Quotation_${quotation.id.split('-')[0]}.pdf`;
    const pdfDir = path.join(__dirname, '..', '..', 'uploads', 'quotations');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, pdfFileName);
    
    await this.generateQuotationPdf(quotation, pdfPath);
    
    quotation.documentPath = pdfFileName;

    let publicUrl = this.configService.get<string>('PUBLIC_APP_URL', '');
    if (!publicUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
      publicUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    }
    if (!publicUrl) publicUrl = 'http://localhost:3001';
    if (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
      publicUrl = `https://${publicUrl}`;
    }
    publicUrl = publicUrl.replace(/\/+$/, '');

    const docUrl = `${publicUrl}/uploads/quotations/${pdfFileName}`;

    const message = `Good day ${quotation.contactPerson},

Please find attached the quotation requested from Tegano Recreation Center.

For any questions or clarifications, kindly contact us.

Kind regards,
Tegano Recreation Center`;

    try {
      await this.whatsappService.sendMessage(quotation.telephone, message, false, [docUrl]);
      this.logger.log(`Quotation ${id} sent successfully to ${quotation.telephone}`);
      
      quotation.status = 'Sent';
      await this.quotationsRepo.save(quotation);
    } catch (e) {
      this.logger.error('Failed to send Quotation WhatsApp message', e);
      throw e;
    }

    return { message: 'Quotation sent successfully' };
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

    if (found.length > 0) {
      let i = 0;
      while (found.length < maxImages) {
        found.push(found[i % found.length]);
        i++;
      }
    }

    return found.slice(0, maxImages);
  }

  private async generateQuotationPdf(quotation: Quotation, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 0, left: 50, right: 50 },
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const pageWidth = 495;
      const pageHeight = doc.page.height;

      const drawFooter = () => {
        doc.fillColor('#0066cc').font('Helvetica-BoldOblique').fontSize(9)
           .text('"Where Kids Experience Fun, Adventure, and Learning"', 50, pageHeight - 80, { align: 'center', width: pageWidth, lineBreak: false });
        doc.fillColor('black').font('Helvetica-Bold').fontSize(8.5)
           .text('"Follow us: Facebook | Instagram | TikTok"', 50, pageHeight - 65, { align: 'center', width: pageWidth, lineBreak: false });
        doc.font('Helvetica')
           .text('DIRECT ALL INQUIRES TO: +263 781499656 / 784700878', 50, pageHeight - 50, { align: 'center', width: pageWidth, lineBreak: false });
      };

      const logoPath = this.getAssetPath('logo.png');
      const logoTop = 38;
      const logoWidth = 95;
      let logoDisplayHeight = 52;
      if (logoPath) {
        try {
          const logoImage = (doc as any).openImage(logoPath);
          logoDisplayHeight = logoWidth * (logoImage.height / logoImage.width);
        } catch (e) {
          this.logger.warn(`Failed to read logo dimensions: ${e.message}`);
        }
      }
      // Divider line sits directly 2pt below the email text (email ends at ~91pt)
      const dividerY = 93;
      const reservationDateY = dividerY + 12;
      const toY = reservationDateY + 18;

      const drawHeader = () => {
        if (logoPath) {
          doc.image(logoPath, 50, logoTop, { width: logoWidth });
        }

        doc.font('Courier-Bold').fontSize(12).fillColor('#0066cc')
           .text('TEGANO INVESTMENT (PVT) LTD', 240, 38, { align: 'right', width: 305 })
           .font('Courier-Bold').fontSize(9.8)
           .text('26 Princess Drive, Newlands, Harare', { align: 'right', width: 305 })
           .text('Tel: +263 781499656 / 784700878', { align: 'right', width: 305 })
           .text('Email: teganoinvestmentpvtltd@gmail.com', { align: 'right', width: 305 });

        // Double divider rule under the letterhead (thin top line + thick bottom line)
        doc.moveTo(50, dividerY).lineTo(50 + pageWidth, dividerY)
           .lineWidth(0.75).strokeColor('black').stroke();
        doc.moveTo(50, dividerY + 2.5).lineTo(50 + pageWidth, dividerY + 2.5)
           .lineWidth(2.5).strokeColor('black').stroke();

        doc.fillColor('black').fontSize(9.5);
      };

      // --- Page 1: Quotation ---
      drawHeader();

      const today = new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });

      const titleY = dividerY + 10;
      doc.rect(50, titleY, 495, 20).fill('#0066cc');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10)
         .text('QUOTATION', 50, titleY + 5, { align: 'center', width: 495 });

      doc.fillColor('black').fontSize(9.5);
      doc.font('Helvetica-Bold').text('Client:', 50, titleY + 28, { align: 'left' });
      doc.text(quotation.schoolName);
      doc.font('Helvetica').text(quotation.districtArea);

      doc.font('Helvetica-Bold').text(`QUOTATION Nº: ${(quotation.id || 'QUOT-123').split('-')[0].toUpperCase()}`, 300, titleY + 28, { align: 'right', width: 245 });
      doc.text(`DATE: ${today}`, { align: 'right', width: 245 });

      doc.y = Math.max(doc.y, titleY + 75);
      doc.x = 50;

      // Table Header
      const tableTop = doc.y + 5;
      doc.rect(50, tableTop, 495, 20).stroke();
      doc.font('Helvetica-Bold').fontSize(9);
      doc.text('Nº', 55, tableTop + 5);
      doc.text('DESCRIPTION', 85, tableTop + 5);
      doc.text('QUANTITY', 275, tableTop + 5);
      doc.text('UNIT COST', 355, tableTop + 5);
      doc.text('TOTAL COST (USD)', 435, tableTop + 5);

      // Table Rows
      let y = tableTop + 20;
      doc.font('Helvetica');
      let grandTotal = 0;

      if (quotation.items && Array.isArray(quotation.items)) {
        quotation.items.forEach((item: any, i: number) => {
          const totalCost = item.quantity * item.unitCost;
          grandTotal += totalCost;

          doc.text((i + 1).toString(), 55, y + 5);
          doc.text(item.description, 85, y + 5, { width: 180 });
          doc.text(item.quantity.toString(), 275, y + 5);
          doc.text(`$${item.unitCost}`, 355, y + 5);
          doc.text(`$${totalCost}`, 435, y + 5);

          y += 35;
        });
      }

      // Draw table borders
      doc.rect(50, tableTop, 30, y - tableTop).stroke();
      doc.rect(80, tableTop, 190, y - tableTop).stroke();
      doc.rect(270, tableTop, 80, y - tableTop).stroke();
      doc.rect(350, tableTop, 80, y - tableTop).stroke();
      doc.rect(430, tableTop, 115, y - tableTop).stroke();

      // Table Footer
      doc.rect(50, y, 495, 20).stroke();
      doc.font('Helvetica-Bold');
      doc.text('TOTAL', 55, y + 5);
      doc.text(`$${grandTotal}`, 435, y + 5);

      doc.y = y + 25;
      doc.x = 50;

      doc.font('Helvetica').fontSize(9.5);
      doc.text('Payment Terms:', 50, doc.y);
      doc.font('Helvetica-Bold').text(quotation.notes || '$50 Deposit on confirmation and balance on arrival date.', { align: 'left', width: 495 });

      doc.moveDown(0.5);
      doc.font('Helvetica').text('A detailed sampled list of activities available during the visit is provided in ', { continued: true });
      doc.font('Helvetica-Bold').text('Annexure 1 attached to this letter.');

      doc.moveDown(0.5);
      doc.font('Helvetica').text('We look forward to welcoming your students for an enjoyable and memorable day at ', { continued: true });
      doc.font('Helvetica-Bold').text('Tegano Recreation Center.');

      doc.moveDown(0.4);
      doc.font('Helvetica').fontSize(9.5).text('Yours sincerely,');

      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(10).text('Emmerson Chitawa');

      const signaturePath = this.getAssetPath('signature.png') || this.getAssetPath('signature.jpg');
      if (signaturePath) {
        const graphicY = doc.y + 2;
        try {
          doc.image(signaturePath, 50, graphicY, { width: 140 });
        } catch (e) {
          this.logger.warn(`Failed to render signature image: ${e.message}`);
        }
        doc.x = 50;
        doc.y = graphicY + 60;
      } else {
        doc.moveDown(0.3);
      }

      doc.font('Helvetica').fontSize(9).text('Facility Supervisor');

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

  async generateSamplePdf(outputPath?: string): Promise<string> {
    const targetDir = path.join(process.cwd(), 'uploads', 'quotations');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = outputPath || path.join(targetDir, 'sample-quotation.pdf');
    const sampleQuotation: Partial<Quotation> = {
      id: 'quot-12345',
      schoolName: 'Heritage School Harare',
      districtArea: 'Borrowdale, Harare',
      notes: '$50 Deposit on confirmation and balance on arrival date.',
      items: [
        { description: 'Student Entrance & Full Activity Pass', quantity: 100, unitCost: 10 },
        { description: 'Accompanying Teacher Entry', quantity: 6, unitCost: 0 },
        { description: 'Buffet Student Lunch & Drinks', quantity: 100, unitCost: 5 },
      ],
    };
    await this.generateQuotationPdf(sampleQuotation as Quotation, targetPath);
    return targetPath;
  }
}
