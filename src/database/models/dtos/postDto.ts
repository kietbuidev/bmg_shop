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

const toNullableString = (value: unknown): string | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value);
};

const toOptionalString = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return String(value);
};

const toBoolean = (value: unknown, fallback?: boolean): boolean | undefined => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'false' || normalized === '0') {
      return false;
    }
  }

  return Boolean(value);
};

const toArray = (value: unknown, fallback: unknown[] | undefined): unknown[] | undefined => {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      return [value];
    }
    return [value];
  }

  return [value];
};

const toNumber = (value: unknown, fallback?: number): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  post_title!: string;

  @IsOptional()
  @IsString()
  post_slug?: string | null;

  @IsOptional()
  @IsString()
  post_description?: string | null;

  @IsOptional()
  @IsString()
  post_content?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({value}) => toNullableString(value))
  post_tag?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({value}) => toNullableString(value))
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @Transform(({value}) => toArray(value, []))
  gallery?: unknown[];

  @IsOptional()
  @Transform(({value}) => toBoolean(value, true))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => toBoolean(value, false))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => toNumber(value, 0))
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @Transform(({value}) => toNumber(value, 0))
  @IsInt()
  author?: number;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  post_title?: string;

  @IsOptional()
  @IsString()
  post_slug?: string | null;

  @IsOptional()
  @IsString()
  post_description?: string | null;

  @IsOptional()
  @IsString()
  post_content?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({value}) => toNullableString(value))
  post_tag?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({value}) => toNullableString(value))
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @Transform(({value}) => toArray(value, undefined))
  gallery?: unknown[];

  @IsOptional()
  @Transform(({value}) => toBoolean(value, undefined))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => toBoolean(value, undefined))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => toNumber(value, undefined))
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @Transform(({value}) => toNumber(value, undefined))
  @IsInt()
  author?: number;
}

export class PostQueryDto {
  @IsOptional()
  @Transform(({value}) => toNumber(value, 1))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({value}) => toNumber(value, 10))
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Transform(({value}) => toBoolean(value, undefined))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => toBoolean(value, undefined))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
