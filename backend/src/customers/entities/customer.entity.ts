import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MessageLog } from '../../messages/entities/message-log.entity';

export enum CustomerCategory {
  INFANT = 'Infant',
  ECD = 'ECD',
  PRIMARY = 'Primary',
}

export enum ContactTitle {
  MR = 'Mr',
  MISS = 'Miss',
  MRS = 'Mrs',
  MUM = 'Mum',
  MADAM = 'Madam',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  schoolName: string;

  @Column({ type: 'enum', enum: CustomerCategory })
  category: CustomerCategory;

  @Column({ length: 30 })
  telephone: string;

  @Column({ type: 'enum', enum: ContactTitle })
  title: ContactTitle;

  @Column({ length: 150 })
  contactPerson: string;

  @Column({ length: 150 })
  districtArea: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @ManyToOne(() => User, (user) => user.createdCustomers, { eager: true, nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @OneToMany(() => MessageLog, (log) => log.customer)
  messageLogs: MessageLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
