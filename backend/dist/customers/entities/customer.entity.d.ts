import { User } from '../../users/entities/user.entity';
import { MessageLog } from '../../messages/entities/message-log.entity';
export declare enum CustomerCategory {
    INFANT = "Infant",
    ECD = "ECD",
    PRIMARY = "Primary"
}
export declare enum ContactTitle {
    MR = "Mr",
    MISS = "Miss",
    MRS = "Mrs",
    MUM = "Mum",
    MADAM = "Madam"
}
export declare class Customer {
    id: string;
    schoolName: string;
    category: CustomerCategory;
    telephone: string;
    title: ContactTitle;
    contactPerson: string;
    districtArea: string;
    observations: string;
    createdBy: User;
    updatedBy: User;
    messageLogs: MessageLog[];
    createdAt: Date;
    updatedAt: Date;
}
