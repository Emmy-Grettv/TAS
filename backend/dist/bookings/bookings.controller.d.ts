import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto, RejectBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createPublic(dto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
    findAll(query: BookingQueryDto, req: any): Promise<import("./entities/booking.entity").Booking[]>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    create(dto: CreateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, dto: UpdateBookingDto): Promise<import("./entities/booking.entity").Booking>;
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
}
