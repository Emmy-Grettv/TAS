import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  schoolName: string;

  @Column({ length: 150 })
  contactPerson: string;

  @Column({ length: 30 })
  telephone: string;

  @Column({ length: 150 })
  districtArea: string;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  items: any;

  @Column({ type: 'text', nullable: true })
  documentPath: string;

  @Column({ length: 50, default: 'Draft' })
  status: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
