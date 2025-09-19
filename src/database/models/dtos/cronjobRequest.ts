import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';
import { isString } from 'lodash';

export class GetHotelCronjobRequest {
  @IsBoolean()
  isExist: boolean = false;
}

export class GetHotelAvailabilityOptionRequest {
  @IsNumber()
  minNight: number;

  @IsNumber()
  maxNight: number;

  @IsNumber()
  minDay: number;

  @IsNumber()
  maxDay: number;

  @IsNumber()
  minRoom: number;

  @IsNumber()
  maxRoom: number;

  @IsNumber()
  minAdult: number;

  @IsNumber()
  maxAdult: number;

  @IsBoolean()
  isExist: boolean = false;
}

export class UpdateAccommodationsRequest {
  @IsBoolean()
  isExist: boolean = false;

  @IsString()
  post_type: string;
}

export class EventsRequest {
  @IsOptional()
  @IsString()
  type?: string;
}

export class UpdateDataFlightRequest {
  @IsString()
  post_type: string;

  @IsString()
  date_time: string;
}

export class UpdateDataPaymentRequest {
  @IsString()
  post_type: string;
}

export class UpdateDataHotelRequest {
  @IsString()
  type: string;
}

export class UpdateEventTrackingRequest {
  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsNumber()
  user_id: number;

  @IsNumber()
  event_id: number;
}

export class SendEventRequest {
  @IsNumber()
  event_id: number;
}

export class SendNotifyRequest {
  @IsString()
  device_token: string;
}