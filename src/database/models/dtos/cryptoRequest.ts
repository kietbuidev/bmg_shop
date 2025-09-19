import {IsString, Min, IsNotEmpty, IsOptional, IsNumber, IsObject} from 'class-validator';

export class SearchCryptoRequest {
  @IsString()
  keyword: string;

  @IsString()
  status: string;
}

export class PaymentFmcRequest {
  @IsOptional()
  @IsString()
  order_token?: string;

  @IsOptional()
  @IsString()
  surcharge_token?: string;

  @IsString()
  currency_fmc: string;

  @IsString()
  currency_ver: string;
}

export class WebhookFmcRequest {
  @IsString()
  requestid: string;

  @IsString()
  version: string;

  @IsString()
  status: string;

  @IsNumber()
  amount: number;

  @IsString()
  address: string;

  @IsString()
  timestamp: string;

  @IsString()
  apikey: string;

  @IsString()
  sign: string;

  @IsObject()
  result: {};
}
