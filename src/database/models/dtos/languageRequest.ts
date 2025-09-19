import {IsString} from 'class-validator';

export class SearchLanguageRequest {
  @IsString()
  keyword: string;

  @IsString()
  status: string;
}
