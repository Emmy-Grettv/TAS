export declare class CreateQuotationDto {
    schoolName: string;
    contactPerson: string;
    telephone: string;
    districtArea: string;
    subject: string;
    notes?: string;
    items?: any;
}
export declare class UpdateQuotationDto {
    schoolName?: string;
    contactPerson?: string;
    telephone?: string;
    districtArea?: string;
    subject?: string;
    notes?: string;
    items?: any;
}
export declare class QuotationQueryDto {
    search?: string;
    schoolName?: string;
    contactPerson?: string;
    districtArea?: string;
    createdById?: string;
}
