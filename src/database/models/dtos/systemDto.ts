import {IsEnum, IsOptional, IsString, MaxLength} from 'class-validator';
import {UploadImageType} from '../../../utils/enums';

export class UploadImageDto {
  @IsOptional()
  @IsString()
  image_base64?: string;

  @IsOptional()
  @IsEnum(UploadImageType)
  type?: UploadImageType;

  @IsOptional()
  @IsString()
  folder_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_name?: string;
}
