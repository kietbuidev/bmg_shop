import {IsNumber, IsDateString, IsArray, ArrayMinSize, ValidateNested, Min, IsNotEmpty, IsObject, IsOptional, IsInt} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {IsDateGreaterThanOrEqualToday, IsDateGreaterThanCheckin, IsListRoomsValid} from '../decorators/searchHotelDecorator';

// class GuestRooms {
//   @IsNumber()
//   @Min(1, {message: 'adult must be at least 1'})
//   adult: number;

//   @IsNumber()
//   child: number;

//   // @IsArray()
//   // @ArrayMinSize(0, {message: 'child_ages must have at least 0 items'})
//   child_ages: number[];
// }

class FilterRequest {
  price: {
    min: number;
    max: number;
  };

  meals: string[];

  policy: string[];

  types: string[];

  facilities: string[]; //amenities

  stars: number[];

  room_policies: SortRequest[];
}

class SortRequest {
  key: string;
  // name: string;
  value: string;
}

export class SearchRoomRequest {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @IsDateString()
  @IsDateGreaterThanOrEqualToday({
    message: 'checkin must be greater than the current date',
  })
  @IsNotEmpty()
  check_in: Date | string;

  @IsDateString()
  @IsDateGreaterThanCheckin({
    message: 'checkout must be greater than checkin by at least 1 day',
  })
  @IsNotEmpty()
  check_out: Date;

  @Type(() => Number)
  @IsInt()
  room: number;

  @Type(() => Number)
  @IsInt()
  adult: number;

  @Type(() => Number)
  child: number = 0;

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  child_ages?: number[] | any = [];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',');
  })
  room_policies?: string[];
}

export class VerifyRoomRequest {
  @ValidateNested({each: true})
  @Type(() => RoomToCart)
  rooms: RoomToCart[];
}

export class RoomToCart {
  @IsNumber()
  id: number;
}
