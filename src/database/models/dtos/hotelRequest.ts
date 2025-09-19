import {IsNumber, IsString, IsDateString, IsArray, ArrayMinSize, ValidateNested, IsOptional, Min, IsNotEmpty, IsObject, IsInt, IsEmail, IsPhoneNumber} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {IsDateGreaterThanOrEqualToday, IsDateGreaterThanCheckin, IsListRoomsValid} from '../decorators/searchHotelDecorator';
import {IsPostOrLocationProvided} from './customValidation';
import {errorCodes} from '../../../utils/errorMessage';
import {NotEmpty} from 'sequelize-typescript';

class ContactInfo {
  @IsOptional()
  @IsNumber()
  buyer?: number;

  @IsString()
  title: string;

  @IsString()
  @Transform(({value}) => {
    return value.trim();
  })
  first_name: string;

  @IsString()
  @Transform(({value}) => {
    return value.trim();
  })
  last_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  phone_code: string;

  @IsOptional()
  @IsString()
  country?: string;
}

class GuestInfo {
  @IsString()
  title: string;

  @IsString()
  @Transform(({value}) => {
    return value.trim();
  })
  first_name: string;

  @IsString()
  @Transform(({value}) => {
    return value.trim();
  })
  last_name: string;
}

export class CustomerInfoCommand {
  @IsOptional()
  @IsString()
  order_token?: string;

  // @IsObject()
  @ValidateNested()
  @Type(() => ContactInfo)
  contact: ContactInfo;

  // @IsObject()
  @ValidateNested()
  @Type(() => GuestInfo)
  guest: GuestInfo;

  @IsString()
  additional: string;
}

// export class GuestRoomRequest {
//   @IsNumber()
//   @Min(1, {message: 'adult must be at least 1'})
//   adult: number;

//   @IsNumber()
//   child: number;

//   // @IsArray()
//   // @ArrayMinSize(0, {message: 'child_ages must have at least 0 items'})
//   child_ages: number[];
// }

// class SortRequest {
//   key: string;
//   name: string;
//   value: string;
// }

// class FilterRequest {
//   price: {
//     min: number;
//     max: number;
//   };

//   meals: string[];

//   policy: string[];

//   types: string[];

//   facilities: string[]; //amenities

//   stars: number[];

//   payment_types?: string[];
// }

export class SearchHotelRequest {
  @IsOptional()
  @Type(() => Number)
  post_id?: number;

  @IsOptional()
  @IsString()
  post_code?: string;

  @IsString()
  @IsNotEmpty()
  post_type?: string;

  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @IsOptional()
  @IsNumber()
  location_lng?: number;

  @IsDateString()
  @IsDateGreaterThanOrEqualToday({
    message: errorCodes.INVALID_CHECKIN_DATE,
  })
  @IsNotEmpty()
  check_in: Date | string;

  @IsDateString()
  @IsDateGreaterThanCheckin({
    message: errorCodes.INVALID_CHECKOUT_DAY,
  })
  @IsNotEmpty()
  check_out: Date | string;

  @Type(() => Number)
  @IsInt()
  room: number;

  @Type(() => Number)
  @IsInt()
  adult: number;

  @Type(() => Number)
  child?: number = 0;

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  child_ages?: number[] | any = [];

  @IsOptional()
  @IsString()
  sort?: string;

  // Filter
  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  price?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  stars?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  property_types?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',');
  })
  payment_types?: string[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',');
  })
  facilities?: string[];

  @IsPostOrLocationProvided({
    message: errorCodes.REQUIRE_DESTINATION,
  })
  placeholder?: string;
}

export class SearchHotelInitRequest {
  @IsOptional()
  @Type(() => Number)
  post_id?: number;

  @IsOptional()
  @IsString()
  post_code?: string;

  @IsString()
  @IsNotEmpty()
  post_type?: string;

  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @IsOptional()
  @IsNumber()
  location_lng?: number;

  @IsDateString()
  @IsDateGreaterThanOrEqualToday({
    message: errorCodes.INVALID_CHECKIN_DATE,
  })
  @IsNotEmpty()
  check_in: Date | string;

  @IsDateString()
  @IsDateGreaterThanCheckin({
    message: errorCodes.INVALID_CHECKOUT_DAY,
  })
  @IsNotEmpty()
  check_out: Date | string;

  @Type(() => Number)
  @IsInt()
  room: number;

  @Type(() => Number)
  @IsInt()
  adult: number;

  @Type(() => Number)
  child?: number = 0;

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  child_ages?: number[] | any = [];

  @IsPostOrLocationProvided({
    message: errorCodes.REQUIRE_DESTINATION,
  })
  placeholder?: string;
}

export class SearchHotelAvailabilityRequest {
  @IsNotEmpty()
  @IsString()
  request_id: string;

  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @IsOptional()
  @IsNumber()
  location_lng?: number;

  // Sort
  @IsOptional()
  @IsString()
  sort?: string;

  // Filter
  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  price?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  stars?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  property_types?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',');
  })
  payment_types?: string[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',');
  })
  facilities?: string[];
}

export class SearchSimilarHotelRequest {
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
  check_out: Date | string;

  @Type(() => Number)
  @IsInt()
  room: number;

  @Type(() => Number)
  @IsInt()
  adult: number;

  @Type(() => Number)
  child: number;

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  child_ages?: number[] | any;
}

export class SearchDetailHotelRequest {
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
  check_out: Date | string;

  @Type(() => Number)
  @IsInt()
  room: number;

  @Type(() => Number)
  @IsInt()
  adult: number;

  @Type(() => Number)
  child: number;

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  child_ages?: number[] | any;
}

export class SearchTranslateHotelRequest {
  @IsNotEmpty()
  keyword: string;
}

export class generateLinkHotelRequest {
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @IsNotEmpty()
  @IsString()
  check_in: Date | string;

  @IsNotEmpty()
  @IsString()
  check_out: Date | string;

  @IsNumber()
  @IsNotEmpty()
  room: number;

  @IsNotEmpty()
  @IsNumber()
  adult: number;

  @IsNumber()
  @IsOptional()
  child: number;

  @IsOptional()
  child_ages?: string;
}
