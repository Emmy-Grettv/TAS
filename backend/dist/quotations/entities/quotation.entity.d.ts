import { User } from '../../users/entities/user.entity';
export declare class Quotation {
    id: string;
    schoolName: string;
    contactPerson: string;
    telephone: string;
    districtArea: string;
    subject: string;
    notes: string;
    items: any;
    documentPath: string;
    status: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
