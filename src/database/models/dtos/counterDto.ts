import {IsDateString, IsIP, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateCounterDto {
  @IsOptional()
  @IsIP()
  @MaxLength(45)
  ip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  os?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  browser?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  device?: string | null;
}

export class GetCounterChartQueryDto {
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
