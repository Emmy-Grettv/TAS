import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { CreateQuotationDto, UpdateQuotationDto, QuotationQueryDto } from './dto/quotation.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
export declare class QuotationsService {
    private quotationsRepo;
    private whatsappService;
    private configService;
    private readonly logger;
    constructor(quotationsRepo: Repository<Quotation>, whatsappService: WhatsappService, configService: ConfigService);
    private buildQuery;
    findAll(query: QuotationQueryDto): Promise<Quotation[]>;
    getStats(): Promise<{
        total: number;
        sent: number;
    }>;
    findOne(id: string): Promise<Quotation>;
    create(dto: CreateQuotationDto, userId: string): Promise<Quotation>;
    update(id: string, dto: UpdateQuotationDto, filePath?: string): Promise<Quotation>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendQuotation(id: string): Promise<{
        message: string;
    }>;
    private generateQuotationPdf;
}
