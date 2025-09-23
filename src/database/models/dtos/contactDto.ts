// dtos/customer-contact.dto.ts
import {IsOptional, IsString, IsEmail, MaxLength, IsInt, Min, IsIn} from 'class-validator';
import {Transform} from 'class-transformer';

export const CONTACT_STATUS_VALUES = ['NEW', 'INPROGRESS', 'RESOLVED'] as const;
export type ContactStatus = (typeof CONTACT_STATUS_VALUES)[number];

export class CreateCustomerContactDto {
  @IsString() @MaxLength(255)
  full_name!: string;

  @IsOptional()
  @IsString() 
  @MaxLength(32)
  phone?: string;

  @IsOptional() 
  @IsString() 
  @MaxLength(255)
  address?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() 
  @IsString()
  @MaxLength(255)
  subject?: string;

  @IsOptional() @IsString()
  message?: string;

  @IsOptional() @IsString()
  attachment?: string;

  @IsOptional()
  @IsIn(CONTACT_STATUS_VALUES)
  status?: ContactStatus;
}

export class ContactQueryDto {
  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? 1 : Number(value)))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  limit?: number;
}

export class UpdateContactNoteDto {
  @IsOptional()
  @IsString()
  note?: string | null;
}

export class UpdateContactDto {
  @IsOptional()
  @IsIn(CONTACT_STATUS_VALUES)
  status?: ContactStatus;

  @IsOptional()
  @IsString()
  note?: string | null;
}
