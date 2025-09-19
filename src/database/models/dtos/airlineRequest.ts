import {IsString} from 'class-validator';

export class SearchAirlineRequest {
  @IsString()
  keyword: string;

  @IsString()
  is_featured: string;
}
