import {IsString} from 'class-validator';

export class SearchCountryRequest {
  @IsString()
  keyword: string;

  @IsString()
  is_featured: string;
}
