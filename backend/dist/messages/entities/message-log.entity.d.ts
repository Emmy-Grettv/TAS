import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
export declare enum MessageStatus {
    SENT = "sent",
    FAILED = "failed"
}
export declare class MessageLog {
    id: string;
    customer: Customer;
    message: string;
    status: MessageStatus;
    errorMessage: string;
    sentBy: User;
    sentAt: Date;
}
