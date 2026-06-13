import { QuotationsService } from './quotations.service';
import { CreateQuotationDto, UpdateQuotationDto, QuotationQueryDto } from './dto/quotation.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    getStats(): Promise<{
        total: number;
        sent: number;
    }>;
    findAll(query: QuotationQueryDto, req: any): Promise<import("./entities/quotation.entity").Quotation[]>;
    findOne(id: string): Promise<import("./entities/quotation.entity").Quotation>;
    create(dto: CreateQuotationDto, req: any): Promise<import("./entities/quotation.entity").Quotation>;
    update(id: string, dto: UpdateQuotationDto, file?: Express.Multer.File): Promise<import("./entities/quotation.entity").Quotation>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendQuotation(id: string): Promise<{
        message: string;
    }>;
}
