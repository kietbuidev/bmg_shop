import {IsOptional, IsString} from 'class-validator';

export class NotificationRequest {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  deeplink?: string;

  data?: any
}
