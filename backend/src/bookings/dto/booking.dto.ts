import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsString()
  @IsOptional()
  poBox?: string;

  @IsString()
  @IsNotEmpty()
  districtArea: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfVisit: string;

  @IsString()
  @IsNotEmpty()
  entrance: string;

  @IsNumber()
  @IsNotEmpty()
  studentsCount: number;

  @IsNumber()
  @IsNotEmpty()
  reservationsCount: number;

  @IsString()
  @IsOptional()
  teachersCount?: string;

  @IsString()
  @IsOptional()
  arrivalTime?: string;

  @IsString()
  @IsOptional()
  departureTime?: string;
}

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  poBox?: string;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsDateString()
  @IsOptional()
  dateOfVisit?: string;

  @IsString()
  @IsOptional()
  entrance?: string;

  @IsNumber()
  @IsOptional()
  studentsCount?: number;

  @IsNumber()
  @IsOptional()
  reservationsCount?: number;

  @IsString()
  @IsOptional()
  teachersCount?: string;

  @IsString()
  @IsOptional()
  arrivalTime?: string;

  @IsString()
  @IsOptional()
  departureTime?: string;
}

export class RejectBookingDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}

export class BookingQueryDto {
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  createdById?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsDateString()
  @IsOptional()
  dateOfVisit?: string;
}
