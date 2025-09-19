import {IsString} from 'class-validator';

export class SearchCityRequest {
  @IsString()
  keyword: string;

  @IsString()
  is_featured: string;
}
