// dtos/customer-contact.dto.ts
import {IsOptional, IsString, IsEmail, MaxLength, IsInt, Min} from 'class-validator';
import {Transform} from 'class-transformer';

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
