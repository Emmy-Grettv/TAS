import { Repository } from 'typeorm';
import { MessageLog } from './entities/message-log.entity';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import { BulkSendDto } from './dto/bulk-send.dto';
export declare class MessagesService {
    private messageLogsRepo;
    private customersService;
    private usersService;
    constructor(messageLogsRepo: Repository<MessageLog>, customersService: CustomersService, usersService: UsersService);
    getStats(): Promise<{
        totalSent: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: MessageLog[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    bulkSend(dto: BulkSendDto, currentUserId: string): Promise<{
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
