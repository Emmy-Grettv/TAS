import { ConfigService } from '@nestjs/config';
import { Customer } from '../customers/entities/customer.entity';
export declare class WhatsappService {
    private configService;
    private twilioClient;
    private readonly twilioNumber;
    private readonly publicAppUrl;
    private readonly logger;
    constructor(configService: ConfigService);
    private getGreeting;
    buildMessage(customer: Customer, customMessage?: string): string;
    sendMessage(to: string, message: string, attachFlyer?: boolean, mediaUrls?: string[]): Promise<{
        messageId: string;
    }>;
}
