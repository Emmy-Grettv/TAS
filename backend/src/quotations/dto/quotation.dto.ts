import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  districtArea: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  items?: any;
}

export class UpdateQuotationDto {
  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  items?: any;
}

export class QuotationQueryDto {
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  districtArea?: string;

  @IsString()
  @IsOptional()
  createdById?: string;
}
