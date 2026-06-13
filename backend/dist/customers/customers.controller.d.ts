import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerQueryDto } from './dto/customer.dto';
import { UsersService } from '../users/users.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly usersService;
    constructor(customersService: CustomersService, usersService: UsersService);
    findAll(query: CustomerQueryDto): Promise<{
        data: import("./entities/customer.entity").Customer[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: number;
        today: number;
        thisMonth: number;
    }>;
    exportAll(query: CustomerQueryDto): Promise<import("./entities/customer.entity").Customer[]>;
    findIds(query: CustomerQueryDto): Promise<string[]>;
    findOne(id: string): Promise<import("./entities/customer.entity").Customer>;
    create(dto: CreateCustomerDto, currentUser: any): Promise<import("./entities/customer.entity").Customer>;
    update(id: string, dto: UpdateCustomerDto, currentUser: any): Promise<import("./entities/customer.entity").Customer>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendWhatsApp(id: string, customMessage: string, currentUser: any): Promise<import("../messages/entities/message-log.entity").MessageLog>;
}
