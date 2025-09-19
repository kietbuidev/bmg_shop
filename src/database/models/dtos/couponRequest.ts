import {IsString} from 'class-validator';
import {isNumber} from 'lodash';

export class SearchCouponRequest {
  @IsString()
  keyword: string;

  @IsString()
  post_type: string;

  @IsString()
  type: number;
}
