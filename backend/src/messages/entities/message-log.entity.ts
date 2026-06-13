import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';

export enum MessageStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('message_logs')
export class MessageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.messageLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @ManyToOne(() => User, (user) => user.sentMessages, { nullable: true })
  @JoinColumn({ name: 'sentById' })
  sentBy: User;

  @CreateDateColumn()
  sentAt: Date;
}
