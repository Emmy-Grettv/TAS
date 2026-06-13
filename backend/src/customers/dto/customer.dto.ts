import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerCategory, ContactTitle } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsEnum(CustomerCategory)
  category: CustomerCategory;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsEnum(ContactTitle)
  title: ContactTitle;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  districtArea: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsEnum(CustomerCategory)
  @IsOptional()
  category?: CustomerCategory;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsEnum(ContactTitle)
  @IsOptional()
  title?: ContactTitle;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class CustomerQueryDto {
  @IsOptional()
  search?: string;

  @IsEnum(CustomerCategory)
  @IsOptional()
  category?: CustomerCategory;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  createdById?: string;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  ids?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
