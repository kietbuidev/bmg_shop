import {IsString} from 'class-validator';

export class SearchPageRequest {
  @IsString()
  keyword: string;

  @IsString()
  status: string;
}
