import {Type} from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  note?: string | null;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreateOrderCustomerDto)
  customer!: CreateOrderCustomerDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
