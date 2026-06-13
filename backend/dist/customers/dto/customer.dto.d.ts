import { CustomerCategory, ContactTitle } from '../entities/customer.entity';
export declare class CreateCustomerDto {
    schoolName: string;
    category: CustomerCategory;
    telephone: string;
    title: ContactTitle;
    contactPerson: string;
    districtArea: string;
    observations?: string;
}
export declare class UpdateCustomerDto {
    schoolName?: string;
    category?: CustomerCategory;
    telephone?: string;
    title?: ContactTitle;
    contactPerson?: string;
    districtArea?: string;
    observations?: string;
}
export declare class CustomerQueryDto {
    search?: string;
    category?: CustomerCategory;
    districtArea?: string;
    createdById?: string;
    dateFrom?: string;
    dateTo?: string;
    ids?: string;
    page?: number;
    limit?: number;
}
