import {Type} from 'class-transformer';
import {IsArray} from 'class-validator';
import OrderFlightPassenger from '../order_flight_passenger';
import { FlightWayType } from 'utils/enums';
import OrderSurcharge from '../order_surcharge';
import OrderCoupon from '../order_coupon';
import Loyalty from '../loyalty';

// export class FlighData {
//   international?: boolean;
//   departure?: FlightWayData;
//   arrival?: FlightWayData;
//   fare_datas?: FareData[];
// }

// export class FlightWayData {
//   session?: string;
//   provider_code?: string;
//   fare_datas?: FareData[];
//   fare_data?: FareData;
// }

export class FareData { // FlightData
  status?: string;
  international: boolean;
  session: string;
  provider_code: string;
  airline: string;
  flight_code?: string;
  flight_number: string;
  is_operating: boolean;
  operator: string;
  currency: string;
  system: string;
  adt: number;
  chd: number;
  inf: number;
  ticket_class?: string;
  group_class?: string;
  start_point: string;
  end_point: string;
  start_terminal?: number | string;
  end_terminal?: number | string;
  stop_num: number;
  start_date: string;
  end_date: string;
  time_start: number;
  time_end: number;
  duration: number;
  airline_name: string;
  airline_image: string;
  city_from: string;
  city_to: string;
  is_selected?: number;
  booking_id?: string;
  booking_code?: string;
  gds_code?: string;
  fare_rule?: string;
  way_type?: string;

  @IsArray()
  @Type(() => FareOption)
  fare_options: FareOption[];

  // Air segment (1 or n)
  air_segments: SegmentData[];

  fare_option?: FareOption;

  vendor_data?: any;
}

export class FareOption { // OrderFlightWay
  uid: string;
  // flight_id: string
  option_key: string;
  // General
  fare_class: string;
  fare_basis: string;
  fare_family: string;
  fare_family_name?: string;
  cabin_code: string;
  cabin_name: string;
  fare_code?: string;
  is_selected?: number;
  availability?: number;
  unavailable?: boolean;

  //HPL
  airline_option_id?: number;
  flight_option_id?: number;
  fare_option_id?: number;
  equipment?: string;
  // 1G TVP
  raw_data_segments?: [] | any;
  fare_rule_key?: [] | any;

  // Price
  total_fare: number;
  penalty?: number;
  currency: string;
  fare_paxs: FarePaxs[];

  // Service
  services: {
    hand_baggage: string;
    free_baggage: string;
    meal: boolean;
    wifi: boolean;
    refundable?: boolean;
    reschedulable?: boolean;
    media?: boolean;
    amenities?: [];
  };
}

export class FarePaxs {
  pax_type: string;
  base_fare: number;
  tax_and_fee: number;
  total_fare: number;
  pax_number: number;
}

export class SegmentData {
  flight_number: string;
  is_operating: boolean;
  operator: string;
  airline: string;
  airline_name: string;
  airline_image: string;
  start_date: string;
  end_date: string;
  start_point: string;
  end_point: string;
  duration: number;
  stop_time: number;
  city_from: string;
  city_to: string;
  airport_from?: string;
  airport_to?: string;
  start_terminal: number | string;
  end_terminal: number | string;
  equipment?: string;
  equipment_name?: string;
}

// export class FlightDataVerifyRequest {
//   order_token: string;
//   departure: FlightWayVerifyData;
//   arrival?: FlightWayVerifyData;
// }

export class FlighWayCache {
  way_type: FlightWayType.DEPARTURE | FlightWayType.ARRIVAL; 
  fare_data: FareData;
  vendor_data: any;
}

export class FlightWayVerifyData {
  session: string;
  verify_data: FlighWayCache;
  change_price: boolean;
  message: string;
  status: number;  
}

export class ContactData {
  title: string;
  title_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone: string;
  country: string;
  address?: string;
  buyer?: number | any;
}

export class PassengerData {
  id: number;
  pax_type: string;
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  
  nationality: string;
  indentity_type?: string;
  identity_number?: string;
  identity_expiry_date?: Date;
  passport_number?: string;
  passport_expiry_date?: Date;
  country_of_issue?: string;
  membership_card_number?: string;
}

export class BaggagesData {
  uid: string;
  session: string;
}

export class MealsData {
  uid: string;
  session: string;
}

export class SeatsData {
  uid: string;
  session: string;
}

export class PaymentDetail {
  total_fare: number;
  total_baggage: number | 0;
  total_meal: number | 0;
  total_seat: number | 0;
  total_addon: number | 0;
  total: number;
  fare_paxs: FarePaxs[];
}

export class OrderFlightCart {
  order_token: string;
  international: boolean;
  provider_code: string;
  post_type: string;
  // flight_ways: {
  //   departure: FlighWayCache,
  //   arrival: FlighWayCache,
  // };
  flight_ways: FlighWayCache [];
  passengers: {
    adt: number,
    chd: number,
    inf: number,
  };
}

export class OrderFlightDetail {
  id: number;
  sku: string;
  provider_code: string;
  post_type?: string;
  order_token: string;
  expired_time_order: Date;  
  expired_time_payment: Date;
  payment_method: string;
  payment_method_name?: string;
  payment_type: string;
  payment_status: string;
  payment_status_name: string;
  payment_data?: {} | any;
  refund_json?: {} | any;
  status: string;
  status_name: string;
  subtotal: number;
  payment_fee: number;
  coupon_price?: number;
  discount_price?: number;
  extra_price?: number;
  total_price: number;
  currency: string;
  coin_number?: number;
  language?: string;
  created_at?: Date | string;
  contact: ContactData;
  passengers:
    | [
        {
          pax_type: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: string;
          id: string;
          baggages?: [
            // {
            //   value: string;
            //   name: string;
            //   price: number;
            //   currency: string;
            //   route: string;
            //   leg: string;
            // },
          ];
          meals?: [];
          seats?: [];
        },
      ]
    | OrderFlightPassenger
    | any;
  flight_details?: {
    departure: FareData | null;
    arrival: FareData | null;
  };
  payment_details?: {
    departure: PaymentDetail | null;
    arrival: PaymentDetail | null;
  };
  surcharges?: OrderSurcharge [];
  can_edit: boolean;
  show_passport: boolean;
  show_identity: boolean;
  show_baggage: boolean;
  show_seat: boolean;
  show_meal: boolean;
  manage_booking: {
    refundable?: boolean;
    reschedulable?: boolean;
    add_addon?: boolean;
    data_correction?: boolean;
    resend_itineraty?: boolean, 
  };
  coupon?: OrderCoupon | null;
  loyalty?: Loyalty | null;
}

export class SurchargeFlightDetail {
  id: number;
  sku: string;
  provider_code: string;
  surcharge_token: string;
  surcharge_type: string;
  expired_time_surcharge: Date;
  expired_time_payment: Date;
  payment_method: string;
  payment_method_name?: string;
  payment_type: string;
  payment_status: string;
  payment_status_name: string;
  payment_data?: {} | any;
  status: string;
  status_name: string;
  subtotal: number;
  payment_fee: number;
  coupon_price?: number;
  total_price: number;
  currency: string;
  // language?: string;
  created_at?: Date | string;
  // contact?: ContactData;
  passengers:
    | [
        {
          pax_type: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: string;
          id: string;
          baggages?: [
          ];
          meals?: [];
          seats?: [];
        },
      ]
    | OrderFlightPassenger
    | any;
  flight_details?: {
    departure: FareData | null;
    arrival: FareData | null;
  };
  payment_details?: {
    departure: PaymentDetail | null;
    arrival: PaymentDetail | null;
  };
  show_baggage: boolean;
  show_seat: boolean;
  show_meal: boolean;
  can_export?: boolean;
}

export class RescheduleFlightDetail {
  id: number;
  sku: string;
  provider_code: string;
  surcharge_token: string;  
  expired_time_surcharge: Date;
  expired_time_payment: Date;
  payment_method: string;
  payment_method_name?: string;
  payment_type: string;
  payment_status: string;
  payment_status_name?: string;
  payment_data?: {} | any;
  status: string;
  status_name?: string;
  currency: string;
  created_at?: Date | string;
  // passengers:
  //   | [
  //       {
  //         pax_type: string;
  //         first_name: string;
  //         last_name: string;
  //         date_of_birth: string;
  //         gender: string;
  //         id: string;
  //         baggages?: [
  //         ];
  //         meals?: [];
  //         seats?: [];
  //       },
  //     ]
  //   | OrderFlightPassenger
  //   | any;
  flight_details?: {
    departure: FareData | null;
    arrival: FareData | null;
    departure_new: FareData | null;
    arrival_new: FareData | null;
  };
  payment_details?: {
    old_price: number;
    new_price: number;
    price_difference: number;
    reschedulable_fee: number;
    payment_fee: number;
    total_charge: number;
  };
  can_export: boolean;
}

export class OptionKeySearchWay {
  uid: string;
  keyword: string;
  airline_option_id?: number;
  flight_option_id?: number;
  fare_option_id?: number;
}

export class TicketClass {
  option_key: string | any;
  session: string;
  adult: number;
  child?: number;
  infant?: number;
  start_point: string;
  end_point: string;
  flight_date: string;
  airline: string;
  ticket_class: string;
}

export class OptionVerifyHPLRequest {
  airline: string;
  session: string;
  airline_option_id: number;
  flight_option_id: number;
  fare_option_id: number;
}

export class FareOptionEncrypt {
  uid: string;
  session: string;
  keyword: string;
  provider_code: string;
  // Remove
  // airline_option_id?: string; // HPL
  // flight_option_id?: string; // HPL
  // fare_option_id?: string; // HPL
  // raw_data_segments?: [] | any; // 1G
  // airline?: string; // Check remove
  // flight_value?: string; // Check remove
  // group_class?: string; // Check remove
  // fare_rule_key?: []; // Check remove
  // fare_class?: string; // Check remove
  // fare_family?: string; // Check remove
  // equipment_number?: string; // Check remove
  // start_point?: string; // Check remove
  // end_point: string; // Check remove
  // adult?: number; // Check remove
  // child?: number; // Check remove
  // infant?: number; // Check remove
  // total_price?: string; // Check remove
}

export class OptionVerifyTVPRequest {
  raw_data_segments: [] | any;
  adult: number;
  child: number;
  infant: number;
}

export class OptionGetSeatMapTVPRequest {
  raw_data_segments: [] | any;
}
