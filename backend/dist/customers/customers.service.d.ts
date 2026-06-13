import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { MessageLog } from '../messages/entities/message-log.entity';
import { CreateCustomerDto, UpdateCustomerDto, CustomerQueryDto } from './dto/customer.dto';
import { User } from '../users/entities/user.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class CustomersService {
    private customersRepo;
    private messageLogsRepo;
    private whatsappService;
    constructor(customersRepo: Repository<Customer>, messageLogsRepo: Repository<MessageLog>, whatsappService: WhatsappService);
    private buildQuery;
    findAll(query: CustomerQueryDto): Promise<{
        data: Customer[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllForExport(query: CustomerQueryDto): Promise<Customer[]>;
    findAllIds(query: CustomerQueryDto): Promise<string[]>;
    findOne(id: string): Promise<Customer>;
    create(dto: CreateCustomerDto, user: User): Promise<Customer>;
    update(id: string, dto: UpdateCustomerDto, user: User): Promise<Customer>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendWhatsApp(customer: Customer, user: User, customMessage?: string): Promise<MessageLog>;
    getStats(): Promise<{
        total: number;
        today: number;
        thisMonth: number;
    }>;
}
