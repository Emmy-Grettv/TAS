import { BookingStatus } from '../entities/booking.entity';
export declare class CreateBookingDto {
    schoolName: string;
    poBox?: string;
    districtArea: string;
    contactPerson: string;
    telephone: string;
    dateOfVisit: string;
    entrance: string;
    studentsCount: number;
    reservationsCount: number;
    teachersCount?: string;
    arrivalTime?: string;
    departureTime?: string;
}
export declare class UpdateBookingDto {
    schoolName?: string;
    poBox?: string;
    districtArea?: string;
    contactPerson?: string;
    telephone?: string;
    dateOfVisit?: string;
    entrance?: string;
    studentsCount?: number;
    reservationsCount?: number;
    teachersCount?: string;
    arrivalTime?: string;
    departureTime?: string;
}
export declare class RejectBookingDto {
    rejectionReason: string;
}
export declare class BookingQueryDto {
    search?: string;
    districtArea?: string;
    contactPerson?: string;
    schoolName?: string;
    createdById?: string;
    status?: BookingStatus;
    dateOfVisit?: string;
}
