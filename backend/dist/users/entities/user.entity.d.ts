import { Customer } from '../../customers/entities/customer.entity';
import { MessageLog } from '../../messages/entities/message-log.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdCustomers: Customer[];
    sentMessages: MessageLog[];
    createdAt: Date;
    updatedAt: Date;
}
