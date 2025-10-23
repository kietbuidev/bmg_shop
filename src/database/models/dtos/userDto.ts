import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Equals, Validate, ValidateIf, Matches, IsBoolean, IsOptional, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ValidatePassword} from '../decorators/registerDecorator';
import type {IUserAddress} from '../../../utils/types';

export class AddressDto implements IUserAddress {
  @IsString()
  @IsNotEmpty()
  detail!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsOptional()
  @IsString()
  district_id?: string | null;

  @IsOptional()
  @IsString()
  province_id?: string | null;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidatePassword)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}

export class VerifyCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code_verify: string;

  @IsString()
  @IsOptional()
  device_token?: string;

  @IsBoolean()
  @IsOptional()
  reset_password?: boolean;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  device_token?: string | null;

  fcm_token?: string | null;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class loginSocialDto {
  @IsString()
  @IsNotEmpty()
  id_token: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  device_token?: string | null;

  fcm_token?: string | null;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidatePassword)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}

export class SendCodeVerify {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code_reset_password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidatePassword)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}

export class UpdatePasswordDto {
  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidatePassword)
  new_password: string;

  @IsString()
  @IsNotEmpty()
  new_confirm_password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto | null;
}

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CheckExistDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserContactDto {
  user_id?: string;
  key?: string;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
}

export class UserPassengerDto {
  user_id: string;
  title: string;
  first_name: string;
  last_name: string;
  pax_type: string;
  date_of_birth: Date;
  nationality: string;
  indentity_type: string;
  identity_number?: string;
  identity_expiry_date?: Date;
  passport_number?: string;
  passport_expiry_date?: Date;
  country_of_issue?: string;
  membership_card_number?: string;
}
