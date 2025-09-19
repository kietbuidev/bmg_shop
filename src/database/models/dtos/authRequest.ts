import {IsEmail, IsString} from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsEmail()
  email: string;

  // @IsString()
  // phone: string;

  @IsString()
  password: string;

  @IsString()
  login_type: number;
}
