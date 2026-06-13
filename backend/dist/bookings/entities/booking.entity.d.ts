import { User } from '../../users/entities/user.entity';
export declare enum BookingStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class Booking {
    id: string;
    schoolName: string;
    poBox: string;
    districtArea: string;
    contactPerson: string;
    telephone: string;
    dateOfVisit: Date;
    entrance: string;
    studentsCount: number;
    teachersCount: string;
    reservationsCount: number;
    arrivalTime: string;
    departureTime: string;
    status: BookingStatus;
    rejectionReason: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
