import {OrderNotificationType} from 'utils/enums';

export class BaseOrderNotificationDto {
  orderToken: string;
  sku: string;
  notificationType: OrderNotificationType;
}

export class FlightConfirmedNotificationDto extends BaseOrderNotificationDto {
  flightNumber: string;
  origin: string;
  destination: string;
}

export class HotelConfirmedNotificationDto extends BaseOrderNotificationDto {
  hotelName: string;
  checkIn: string;
  checkOut: string;
}

export type OrderConfirmedNotificationDto = FlightConfirmedNotificationDto | HotelConfirmedNotificationDto;
