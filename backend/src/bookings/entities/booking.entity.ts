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

export enum BookingStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  schoolName: string;

  @Column({ length: 150, nullable: true })
  poBox: string;

  @Column({ length: 150 })
  districtArea: string;

  @Column({ length: 150 })
  contactPerson: string;

  @Column({ length: 30 })
  telephone: string;

  @Column({ type: 'date' })
  dateOfVisit: Date;

  @Column({ length: 100 })
  entrance: string;

  @Column({ type: 'int' })
  studentsCount: number;

  @Column({ length: 50, nullable: true })
  teachersCount: string;

  @Column({ type: 'int' })
  reservationsCount: number;

  @Column({ length: 20, nullable: true })
  arrivalTime: string;

  @Column({ length: 20, nullable: true })
  departureTime: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
