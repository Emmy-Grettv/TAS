import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto, RejectBookingDto } from './dto/booking.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
export declare class BookingsService {
    private bookingsRepo;
    private whatsappService;
    private configService;
    private readonly logger;
    constructor(bookingsRepo: Repository<Booking>, whatsappService: WhatsappService, configService: ConfigService);
    private buildQuery;
    findAll(query: BookingQueryDto): Promise<Booking[]>;
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
    findOne(id: string): Promise<Booking>;
    create(dto: CreateBookingDto, userId: string): Promise<Booking>;
    update(id: string, dto: UpdateBookingDto): Promise<Booking>;
    remove(id: string): Promise<{
        message: string;
    }>;
    approve(id: string): Promise<{
        message: string;
        pdfUrl: string;
    }>;
    reject(id: string, dto: RejectBookingDto): Promise<{
        message: string;
    }>;
    private generateReservationPdf;
}
