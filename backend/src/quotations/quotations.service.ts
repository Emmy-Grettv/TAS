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

      const publicUrl = this.configService.get<string>('PUBLIC_APP_URL', 'http://localhost:3001');
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

    const publicUrl = this.configService.get<string>('PUBLIC_APP_URL', 'http://localhost:3001');
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

  private async generateQuotationPdf(quotation: Quotation, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // --- Page 1: Letter ---
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0066cc')
         .text('TEGANO INVESTMENT (PVT) LTD', 300, 50, { align: 'right', width: 240 })
         .font('Helvetica')
         .text('26 Princess Drive, Newlands, Harare', { align: 'right', width: 240 })
         .text('Tel: +263 781499656 / 784700878', { align: 'right', width: 240 })
         .text('Email: teganoinvestmentpvtltd@gmail.com', { align: 'right', width: 240 });
         
      doc.moveDown(1.5);
      
      // Reset left alignment context by specifying X=50, Y=doc.y
      const titleY = doc.y;
      doc.rect(50, titleY, 495, 20).fill('#0066cc');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10)
         .text('QUOTATION', 50, titleY + 5, { align: 'center', width: 495 });
      
      doc.fillColor('black').fontSize(9.5).moveDown(1.5);

      doc.font('Helvetica-Bold').text('Client:', 50, doc.y, { align: 'left' });
      doc.text(quotation.schoolName);
      doc.font('Helvetica').text(quotation.districtArea);
      
      const today = new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });
      doc.font('Helvetica-Bold').text(`QUOTATION Nº: ${quotation.id.split('-')[0].toUpperCase()}`, 300, titleY + 30, { align: 'right', width: 245 });
      doc.text(`DATE: ${today}`, { align: 'right', width: 245 });
      
      doc.y = Math.max(doc.y, titleY + 80);
      doc.x = 50;

      // Table Header
      const tableTop = doc.y + 10;
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
          
          y += 40; // adjust height nicely
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

      doc.y = y + 30;
      doc.x = 50;

      doc.font('Helvetica').fontSize(9.5);
      doc.text('Payment Terms:', 50, doc.y);
      doc.font('Helvetica-Bold').text(quotation.notes || '$50 Deposit on confirmation and balance on arrival date.', { align: 'left', width: 495 });
      
      doc.moveDown(0.8);
      doc.font('Helvetica').text('A detailed sampled list of activities available during the visit is provided in ', { continued: true });
      doc.font('Helvetica-Bold').text('Annexure 1 attached to this letter.');
      
      doc.moveDown(0.8);
      doc.font('Helvetica').text('We look forward to welcoming your students for an enjoyable and memorable day at ', { continued: true });
      doc.font('Helvetica-Bold').text('Tegano Recreation Center.');

      doc.moveDown(1);
      doc.font('Helvetica').text('Yours sincerely,');
      doc.moveDown(0.6);
      doc.font('Helvetica-Bold').text('Emmerson Chitawa');
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
      
      const imgY = doc.y;

      doc.rect(50, imgY, 230, 120)
         .fillAndStroke('#f8fafc', '#cbd5e1');
      doc.fillColor('#475569')
         .font('Helvetica-Bold')
         .text('[ Place Image here ]', 50, imgY + 50, { width: 230, align: 'center' });

      doc.rect(315, imgY, 230, 120)
         .fillAndStroke('#f8fafc', '#cbd5e1');
      doc.fillColor('#475569')
         .text('[ Place Image here ]', 315, imgY + 50, { width: 230, align: 'center' });

      doc.x = 50;
      doc.y = imgY + 135;
      
      doc.font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text('All activities are conducted under the supervision of trained staff to ensure the safety and enjoyment of all participants.', { align: 'center', width: 495 });
      
      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }
}
