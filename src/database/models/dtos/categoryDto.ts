import {Transform} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { String } from 'lodash';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? null : String(value)))
  parent_id?: string | null;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? null : String(value)))
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  gallery?: string[];

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return true;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return Boolean(value);
  })
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return Boolean(value);
  })
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? 0 : Number(value)))
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  meta_title?: string | null;

  @IsOptional()
  @IsString()
  meta_keyword?: string | null;

  @IsOptional()
  @IsString()
  meta_description?: string | null;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? null : String(value)))
  parent_id?: string | null;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? null : String(value)))
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  gallery?: string[];

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return Boolean(value);
  })
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return Boolean(value);
  })
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? undefined : Number(value)))
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  meta_title?: string | null;

  @IsOptional()
  @IsString()
  meta_keyword?: string | null;

  @IsOptional()
  @IsString()
  meta_description?: string | null;
}

export class CategoryQueryDto {
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

  @IsOptional()
  @Transform(({value}) => (value === undefined || value === null || value === '' ? null : Number(value)))
  @IsInt()
  @Min(1)
  parent_id?: number | null;

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true' || value === '1';
    return Boolean(value);
  })
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
