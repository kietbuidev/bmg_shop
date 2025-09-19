import {Transform} from 'class-transformer';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class SearchCurrencyRequest {
  @IsString()
  keyword: string;

  @IsString()
  status: string;
}

export class FormatCurrencyRequest {
  @IsNumber()
  price: number;

  @IsString()
  currency: string;
}

// export class ExrateVietComBankResponse {
//   $: {
//     CurrencyCode: 'AUD';
//     CurrencyName: 'AUSTRALIAN DOLLAR   ';
//     Buy: '16,104.85';
//     Transfer: '16,267.53';
//     Sell: '16,790.60';
//   };
// }

export class ConvertCurrencyRequest {
  @IsNumber()
  price: number;

  @IsString()
  origin: string;

  @IsString()
  target: string;
}

export class ConvertPriceRequest {
  @IsString()
  type: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => {
    return value.toUpperCase();
  })
  origin: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => {
    return value.toUpperCase();
  })
  target: string;
}
