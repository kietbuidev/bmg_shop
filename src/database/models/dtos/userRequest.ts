import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UserContactRequest {
  @IsOptional()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  title: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  phone_code: string;

  @IsOptional()
  country: string;
}

export class UserPassengerRequest {
  @IsOptional()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  date_of_birth: string;

  // @IsOptional()
  // indentity_type: string;

  @IsNotEmpty()
  nationality: string;

  @IsOptional()
  pax_type: string;

  @IsOptional()
  identity_number: string;

  @IsOptional()
  passport_number: string;

  @IsOptional()
  passport_expiry_date: string | Date;

  @IsOptional()
  country_of_issue: string;

  @IsOptional()
  membership_card_number: string;
}

export class UserFcmTokenRequest {
  @IsNotEmpty()
  @IsString()
  fcm_token: string;
}
