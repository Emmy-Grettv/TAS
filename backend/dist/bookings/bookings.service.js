"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const config_1 = require("@nestjs/config");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let BookingsService = BookingsService_1 = class BookingsService {
    bookingsRepo;
    whatsappService;
    configService;
    logger = new common_1.Logger(BookingsService_1.name);
    constructor(bookingsRepo, whatsappService, configService) {
        this.bookingsRepo = bookingsRepo;
        this.whatsappService = whatsappService;
        this.configService = configService;
    }
    buildQuery(query) {
        const qb = this.bookingsRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.createdBy', 'createdBy')
            .orderBy('booking.createdAt', 'DESC');
        if (query.search) {
            qb.andWhere(`(booking.schoolName ILIKE :search OR booking.contactPerson ILIKE :search OR booking.districtArea ILIKE :search)`, { search: `%${query.search}%` });
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
    async findAll(query) {
        return this.buildQuery(query).getMany();
    }
    async getStats() {
        const [total, pending, approved, rejected] = await Promise.all([
            this.bookingsRepo.count(),
            this.bookingsRepo.count({ where: { status: booking_entity_1.BookingStatus.PENDING } }),
            this.bookingsRepo.count({ where: { status: booking_entity_1.BookingStatus.APPROVED } }),
            this.bookingsRepo.count({ where: { status: booking_entity_1.BookingStatus.REJECTED } }),
        ]);
        return {
            total,
            pending,
            approved,
            rejected,
        };
    }
    async findOne(id) {
        const booking = await this.bookingsRepo.findOne({ where: { id }, relations: ['createdBy'] });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async create(dto, userId) {
        const booking = this.bookingsRepo.create({
            ...dto,
            ...(userId ? { createdBy: { id: userId } } : {}),
        });
        return this.bookingsRepo.save(booking);
    }
    async update(id, dto) {
        const booking = await this.findOne(id);
        Object.assign(booking, dto);
        return this.bookingsRepo.save(booking);
    }
    async remove(id) {
        const booking = await this.findOne(id);
        await this.bookingsRepo.remove(booking);
        return { message: 'Booking deleted successfully' };
    }
    async approve(id) {
        const booking = await this.findOne(id);
        if (booking.status === booking_entity_1.BookingStatus.APPROVED) {
            throw new Error('Booking is already approved');
        }
        const pdfFileName = `Reservation_${booking.id.split('-')[0]}.pdf`;
        const pdfPath = path.join(__dirname, '..', '..', 'uploads', 'bookings', pdfFileName);
        await this.generateReservationPdf(booking, pdfPath);
        booking.status = booking_entity_1.BookingStatus.APPROVED;
        await this.bookingsRepo.save(booking);
        const publicUrl = this.configService.get('PUBLIC_APP_URL', 'http://localhost:3001');
        const pdfUrl = `${publicUrl}/uploads/bookings/${pdfFileName}`;
        const message = `Good day ${booking.contactPerson},

Your reservation at Tegano Recreation Center has been approved.

Please find attached your reservation confirmation letter.

We look forward to welcoming your learners.

Kind regards,
Tegano Recreation Center`;
        try {
            await this.whatsappService.sendMessage(booking.telephone, message, false, [pdfUrl]);
        }
        catch (e) {
            this.logger.error('Failed to send WhatsApp message', e);
        }
        return { message: 'Booking approved successfully', pdfUrl };
    }
    async reject(id, dto) {
        const booking = await this.findOne(id);
        booking.status = booking_entity_1.BookingStatus.REJECTED;
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
        }
        catch (e) {
            this.logger.error('Failed to send WhatsApp message', e);
        }
        return { message: 'Booking rejected successfully' };
    }
    getAssetPath(filename) {
        const candidates = [
            path.join(__dirname, '..', 'assets', filename),
            path.join(__dirname, '..', '..', 'assets', filename),
            path.join(process.cwd(), 'assets', filename),
            path.join(process.cwd(), 'src', 'assets', filename),
            path.join(process.cwd(), 'dist', 'assets', filename),
            path.join(process.cwd(), '..', 'frontend', 'public', 'images', filename),
        ];
        for (const p of candidates) {
            if (fs.existsSync(p))
                return p;
        }
        return null;
    }
    getActivityImagePaths(maxImages = 6) {
        const found = [];
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
                if (found.length >= maxImages)
                    break;
                const p = this.getAssetPath(name);
                if (p && !found.includes(p))
                    found.push(p);
            }
        }
        if (found.length === 0) {
            const flyer = this.getAssetPath('flyer.jpg');
            if (flyer)
                found.push(flyer);
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
    async generateReservationPdf(booking, filePath) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
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
            const logoTop = 45;
            const logoWidth = 120;
            let logoDisplayHeight = 90;
            if (logoPath) {
                try {
                    const logoImage = doc.openImage(logoPath);
                    logoDisplayHeight = logoWidth * (logoImage.height / logoImage.width);
                }
                catch (e) {
                    this.logger.warn(`Failed to read logo dimensions: ${e.message}`);
                }
            }
            const companyBlockBottom = 95;
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
                doc.moveTo(50, dividerY).lineTo(50 + pageWidth, dividerY)
                    .lineWidth(1).strokeColor('black').stroke();
                doc.fillColor('black').fontSize(9.5);
            };
            drawHeader();
            const reservationDate = new Date().toLocaleDateString('en-GB');
            doc.fontSize(9).text(`Reservation Date: ${reservationDate}`, 50, reservationDateY, { align: 'right', width: pageWidth });
            doc.font('Helvetica-Bold').fontSize(9.5).text(`To: ${booking.schoolName}`, 50, toY, { align: 'left' });
            doc.font('Helvetica').fontSize(9);
            if (booking.poBox)
                doc.text(`PO Box: ${booking.poBox}`);
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
            const stampPath = this.getAssetPath('stamp.png') || this.getAssetPath('stamp.jpg');
            if (signaturePath || stampPath) {
                const graphicY = doc.y + 2;
                if (signaturePath) {
                    try {
                        doc.image(signaturePath, 50, graphicY, { width: 110 });
                    }
                    catch (e) {
                        this.logger.warn(`Failed to render signature image: ${e.message}`);
                    }
                }
                if (stampPath) {
                    try {
                        doc.image(stampPath, 115, graphicY - 5, { width: 85 });
                    }
                    catch (e) {
                        this.logger.warn(`Failed to render stamp image: ${e.message}`);
                    }
                }
                doc.x = 50;
                doc.y = graphicY + 45;
            }
            else {
                doc.moveDown(0.4);
            }
            doc.font('Helvetica-Bold').fontSize(9).text('Emmerson Chitawa');
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(8.5).text('Facility Supervisor');
            drawFooter();
            doc.addPage();
            drawHeader();
            doc.font('Helvetica-Bold').fontSize(10).text('ANNEXURE 1', 50, toY, { align: 'left' });
            doc.fontSize(9.5).text('School Trip Activities – Tegano Recreation Center');
            doc.font('Helvetica').fontSize(8.5).moveDown(0.3);
            doc.text('During the visit, students will have access to the following supervised recreational activities designed to provide fun, physical exercise, and social interaction in a safe environment:', { width: pageWidth });
            doc.moveDown(0.3);
            doc.fontSize(8);
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
                doc.text(item, 50, currentY, { width: pageWidth });
                currentY = doc.y + 0.5;
            });
            doc.y = currentY;
            doc.fontSize(9).moveDown(0.4);
            doc.font('Helvetica-Bold').text('Sample Pictures of Activities:');
            doc.moveDown(0.3);
            const imageY = doc.y;
            const images = this.getActivityImagePaths(6);
            const footerBlockHeight = 40;
            const safetyNoteHeight = 24;
            const spacingBeforeNote = 8;
            const spacingBeforeFooter = 6;
            const reservedBottom = footerBlockHeight + safetyNoteHeight + spacingBeforeNote + spacingBeforeFooter;
            const bottomLimit = pageHeight - 50 - reservedBottom;
            const availableHeight = Math.max(bottomLimit - imageY, 50);
            const drawBox = (imgPath, x, y, w, h, idx) => {
                try {
                    doc.save();
                    doc.rect(x, y, w, h).clip();
                    doc.image(imgPath, x, y, { cover: [w, h], align: 'center', valign: 'center' });
                    doc.restore();
                }
                catch (e) {
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
                drawBox(images[0], 50, row0Y, leftWidth, rowHeight, 0);
                drawBox(images[1], 50, row1Y, leftWidth, rowHeight, 1);
                drawBox(images[2], rightX, row0Y, rightCellWidth, rowHeight, 2);
                drawBox(images[3], rightX + rightCellWidth + boxGap, row0Y, rightCellWidth, rowHeight, 3);
                drawBox(images[4], rightX, row1Y, rightCellWidth, rowHeight, 4);
                if (images[5]) {
                    drawBox(images[5], rightX + rightCellWidth + boxGap, row1Y, rightCellWidth, rowHeight, 5);
                }
                doc.x = 50;
                doc.y = row1Y + rowHeight + spacingBeforeNote;
            }
            else if (images.length > 0) {
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
            }
            else {
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        whatsapp_service_1.WhatsappService,
        config_1.ConfigService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map