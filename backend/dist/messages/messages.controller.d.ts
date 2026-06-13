import { MessagesService } from './messages.service';
import { BulkSendDto } from './dto/bulk-send.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getStats(): Promise<{
        totalSent: number;
    }>;
    findAll(page: number, limit: number): Promise<{
        data: import("./entities/message-log.entity").MessageLog[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    bulkSend(dto: BulkSendDto, currentUser: any): Promise<{
        results: {
            customerId: string;
            status: string;
            error?: string;
        }[];
        summary: {
            sent: number;
            failed: number;
            total: number;
        };
    }>;
}
