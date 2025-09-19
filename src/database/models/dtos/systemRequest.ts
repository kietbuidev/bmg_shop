import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class generateShortLinkRequest {
  @IsString()
  @IsNotEmpty()
  origin_link: string;

  @IsOptional()
  @IsString()
  expired_at: string;
}
