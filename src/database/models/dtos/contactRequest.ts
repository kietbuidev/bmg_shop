import {IsArray, IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class ContactOrder {
  @IsNotEmpty()
  @IsString()
  booking_id?: string;

  @IsOptional()
  @IsString()
  order_token?: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  phone_code: string;

  @IsNotEmpty()
  @IsString()
  post_type: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attached_files?: string[];
}
