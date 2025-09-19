import {Transform, Type} from 'class-transformer';
import {IsNumber, IsNotEmpty, IsString, IsObject, IsOptional, IsEmail, ValidateNested} from 'class-validator';

// export class SearchOrderRequest {
//   @IsString()
//   post_type: string;

//   @IsString()
//   keyword: string;
// }

export class SearchOrderRequest {
  @IsString()
  email: string;

  @IsString()
  code: string;

  // @IsNumber()
  buyer?: number;
}

export class FMCPayInfo {
  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  secretKey?: string;
}

export class StripeInfo {
  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  secretKey?: string;

  @IsOptional()
  @IsString()
  signingSecret: string;
}

export class CardInfoDto {
  // @IsString()
  // name: string;

  // @IsString()
  // number: string;

  // @IsString()
  // exp_month: string;

  // @IsString()
  // exp_year: string;

  // @IsString()
  // cvc: string;

  @IsOptional()
  @IsString()
  TypeGuarantee?: string | any;

  @IsOptional()
  @IsString()
  TypeCard?: string;

  @IsString()
  ExpDate: string;

  @IsString()
  Number: string;

  @IsString()
  CVV: string;

  @IsString()
  CardHolderName: string;

  @IsString()
  CardSurname: string;

  @IsString()
  CardFirstName: string;
}

export class PaymentCreditCardRequest {
  @IsOptional()
  order_token?: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}

export class PaymentAppotaRequest {
  @IsOptional()
  @IsString()
  order_token?: string;

  @IsOptional()
  @IsString()
  surcharge_token?: string;

  @IsOptional()
  client_ip?: string;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  bank_code?: string;
}

export class OrderDetailRequest {
  @IsOptional()
  @IsString()
  order_token?: string;

  // @IsNumber()
  // @IsNotEmpty()
  // user_id: number;
}

export class MyBookingRequest {
  @IsOptional()
  @IsNumber()
  buyer?: number;

  @IsOptional()
  @IsString()
  post_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  order_tokens?: string[];
}

export class OrderJsonResponse {
  created_at: Date | string;
  order_token: string;
  provider_code: string;
  flights: [
    {
      session: string;
      fare_data_id: number;
      airline: string;
      currency: string;
      system: string;
      adt: number;
      chd: number;
      inf: number;
      total_price: number;
      fare_per_pax: number;
      fare_adt: number;
      fare_chd: number;
      fare_inf: number;
      tax_adt: number;
      tax_chd: number;
      tax_inf: number;
      total_price_adt: number;
      total_price_chd: number;
      total_price_inf: number;
      flight_details: [
        {
          is_pacific: false;
          operating: string;
          flight_number: string;
          flight_value: string;
          airline_name: string;
          airline_image: string;
          group_class: string;
          fare_class: string;
          fare_code: string;
          start_date: string;
          start_point: string;
          end_date: string;
          end_point: string;
          stop_num: number;
          duration: number;
          air_segments: [
            {
              flight_number: string;
              airline_name: string;
              airline_image: string;
              flight_key: string;
              plane: string;
              start_terminal: string;
              end_terminal: string;
              hand_baggage: string;
              free_baggage: string;
              cabin: string;
              plan_name: string;
              city_from: string;
              city_to: string;
              start_date: string;
              end_date: string;
              start_point: string;
              end_point: string;
            },
          ];
        },
      ];
      is_min_price: number;
    },
  ];
  thirdparty: {};
  contact: {};
  passengers: [];
}

export class OrderFlightCheckoutData {
  contact: {} | any;
  passengers: any;
  flight_vendor: {
    booking: {};
    ticket: {};
  };
}

export class ProductDataStripe {
  name: string;
  images: [] | any;
  description: string;
}

// export class CardInfor {
//   @IsString()
//   TypeGuarantee: string;

//   @IsString()
//   TypeCard: string;

//   @IsString()
//   ExpDate: string;

//   @IsString()
//   Number: string;

//   @IsString()
//   CVV: string;

//   @IsString()
//   CardHolderName: string;

//   @IsString()
//   CardSurname: string;

//   @IsString()
//   CardFirstName: string;
// }

export class CardInforDecryptAES {
  @IsString()
  name: string;

  @IsString()
  number: string;

  @IsString()
  exp_month: string;

  @IsString()
  exp_year: string;

  @IsString()
  cvc: string;
}

export class SearchCouponRequest {
  @IsString()
  order_token: string;

  @IsOptional()
  @IsString()
  keyword: string;
}

export class ApplyCouponRequest {
  @IsString()
  @IsNotEmpty()
  order_token: string;

  @IsString()
  @IsNotEmpty()
  promotion_code: string;
}

export class ResendEmailRequest {
  // @IsString()
  order_token: string;

  @IsOptional()
  @IsEmail()
  email: string;
}

export class SurchargeFlightWayRequest {
  surcharge_token?: string;

  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ValidateNested()
  @Type(() => FlightWaySurcharge)
  flights: {
    departure: FlightWaySurcharge;
  };
}

export class FlightWaySurcharge {
  @ValidateNested()
  option_key: string;
}
