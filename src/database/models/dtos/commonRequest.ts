import {IsString} from 'class-validator';

export class SearchRequest {
  @IsString()
  keyword: string;
}
