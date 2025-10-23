import {Type} from 'class-transformer';
import {Transform} from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import {PaymentMethod} from '../../../utils/enums';

const ORDER_STATUS_VALUES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
] as const;

const toOptionalUppercaseStatus = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : undefined;
};

const toRequiredUppercaseStatus = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toUpperCase();
};

const toOptionalTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class CreateOrderItemDto {
  @IsUUID()
  product_id!: string;

  @IsOptional()
  @IsString()
  selected_size?: string | null;

  @IsOptional()
  @IsString()
  selected_color?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateOrderCustomerDto {
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsNotEmpty()
  @IsString()
  phone?: string | null;

  @IsNotEmpty()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  note?: string | null;
}

export class CreateOrderDto {
  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsEnum(PaymentMethod, {message: `payment_method must be one of: ${Object.values(PaymentMethod).join(', ')}`})
  payment_method!: PaymentMethod;

  @ValidateNested()
  @Type(() => CreateOrderCustomerDto)
  customer!: CreateOrderCustomerDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}

export class OrderListQueryDto {
  @IsOptional()
  @Transform(({value}) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 1 ? Math.trunc(parsed) : undefined;
  })
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({value}) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 1 ? Math.trunc(parsed) : undefined;
  })
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Transform(({value}) => toOptionalUppercaseStatus(value))
  @IsIn([...ORDER_STATUS_VALUES, 'ALL'], {message: `status must be one of: ${[...ORDER_STATUS_VALUES, 'ALL'].join(', ')}`})
  status?: string;

  @IsOptional()
  @Transform(({value}) => toOptionalTrimmedString(value))
  @IsString()
  keyword?: string;
}

export class UpdateOrderStatusDto {
  @Transform(({value}) => toRequiredUppercaseStatus(value))
  @IsString()
  @IsNotEmpty()
  @IsIn(ORDER_STATUS_VALUES, {message: `status must be one of: ${ORDER_STATUS_VALUES.join(', ')}`})
  status!: (typeof ORDER_STATUS_VALUES)[number];
}

export const ORDER_STATUS_FILTER_VALUES = ORDER_STATUS_VALUES;

export class OrderSearchQueryDto {
  @IsOptional()
  @Transform(({value}) => toOptionalTrimmedString(value))
  @IsString()
  email?: string;

  @IsOptional()
  @Transform(({value}) => toOptionalTrimmedString(value))
  @IsString()
  phone?: string;
}
