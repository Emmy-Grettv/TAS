import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class BulkSendDto {
  @IsArray()
  @IsUUID('4', { each: true })
  customerIds: string[];

  @IsString()
  @IsOptional()
  customMessage?: string;

  @IsOptional()
  attachFlyer?: boolean;
}
