import {Transform} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

const toBooleanWithDefault = (value: unknown, defaultValue?: boolean): boolean | undefined => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
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

const toDecimalNumber = (value: unknown, defaultValue?: number): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'number') {
    return value;
  }

  const normalized = typeof value === 'string' ? value.trim().replace(/,/g, '') : value;
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return Number.NaN;
  }

  return parsed;
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

export class CreateProductDto {
  @Transform(({value}) => (value === undefined || value === null ? value : String(value)))
  @IsNotEmpty()
  @IsUUID('4', {message: 'category_id must be a valid UUID v4'})
  category_id!: string;

  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  code!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  short_description?: string | null;

  @IsOptional()
  @IsString()
  content?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  @Transform(({value}) => toArray(value, []))
  material?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({value}) => toNullableString(value))
  style?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({value}) => toNullableString(value))
  status?: string | null;

  @IsNotEmpty()
  @Transform(({value}) => toNullableString(value))
  thumbnail?: string | null;

  @IsOptional()
  @IsArray()
  @Transform(({value}) => toArray(value, []))
  gallery?: unknown[];

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  @Transform(({value}) => toArray(value, []))
  colors?: string[];

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, 0))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'regular_price must be decimal with max 2 digits'})
  regular_price?: number;

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, 0))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'sale_price must be decimal with max 2 digits'})
  sale_price?: number;

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, 0))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'percent must be decimal with max 2 digits'})
  percent?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsArray()
  @Transform(({value}) => toArray(value, []))
  sizes?: unknown[];

  @IsOptional()
  @Transform(({value}) => toBooleanWithDefault(value, true))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => toBooleanWithDefault(value, false))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') {
      return 0;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  })
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

export class UpdateProductDto {
  @IsOptional()
  @Transform(({value}) => (value === undefined ? undefined : String(value)))
  @IsUUID('4', {each: false, message: 'category_id must be a valid UUID v4'})
  category_id?: string;

  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional() @IsString() @MaxLength(64)
  code?: string;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString()
  short_description?: string | null;

  @IsOptional() @IsString()
  content?: string | null;

  @IsOptional() @IsArray() @IsString({each: true})
  @Transform(({value}) => toArray(value, undefined))
  material?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({value}) => (value === undefined ? undefined : toNullableString(value)))
  style?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({value}) => (value === undefined ? undefined : toNullableString(value)))
  status?: string | null;

  @IsNotEmpty()
  @Transform(({value}) => toNullableString(value))
  thumbnail?: string | null;

  @IsOptional() @IsArray()
  @Transform(({value}) => toArray(value, undefined))
  gallery?: unknown[];

  @IsOptional() @IsArray() @IsString({each: true})
  @Transform(({value}) => toArray(value, undefined))
  colors?: string[];

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, undefined))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'regular_price must be decimal with max 2 digits'})
  regular_price?: number;

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, undefined))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'sale_price must be decimal with max 2 digits'})
  sale_price?: number;

  @IsOptional()
  @Transform(({value}) => toDecimalNumber(value, undefined))
  @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2}, {message: 'percent must be decimal with max 2 digits'})
  percent?: number;

  @IsOptional() @IsString() @MaxLength(8)
  currency?: string;

  @IsOptional() @IsArray()
  @Transform(({value}) => toArray(value, undefined))
  // @IsString({ each: true }) // nếu chỉ cho phép chuỗi
  sizes?: unknown[];

  @IsOptional()
  @Transform(({value}) => toBooleanWithDefault(value, undefined))
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @Transform(({value}) => toBooleanWithDefault(value, undefined))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  @IsInt() @Min(0)
  priority?: number;

  @IsOptional() @IsString() @MaxLength(255)
  meta_title?: string | null;

  @IsOptional() @IsString()
  meta_keyword?: string | null;

  @IsOptional() @IsString()
  meta_description?: string | null;
}

export class ProductQueryDto {
  @IsOptional() @Transform(({value}) => {
    const n = Number(value); return Number.isFinite(n) && n >= 1 ? n : undefined;
  }) @IsInt() @Min(1)
  page?: number;

  @IsOptional() @Transform(({value}) => {
    const n = Number(value); return Number.isFinite(n) && n >= 1 ? n : undefined;
  }) @IsInt() @Min(1)
  limit?: number;

  @IsOptional()
  @Transform(({value}) => toOptionalString(value))
  @IsUUID('4', { message: 'category_id must be a valid UUID v4' })
  category_id?: string;

  @IsOptional()
  @Transform(({value}) => toBooleanWithDefault(value, undefined))
  @IsBoolean()
  is_popular?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    const str = toOptionalString(value);
    return str ? str.trim() : str;
  })
  @IsString()
  status?: string;

  @IsOptional() @IsString()
  search?: string;
}
