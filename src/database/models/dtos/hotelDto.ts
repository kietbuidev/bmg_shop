import Loyalty from '../loyalty';
import OrderCoupon from '../order_coupon';
import OrderSurcharge from '../order_surcharge';
import Room from '../room';

// export class GuestRooms {
//   adult: number;
//   child: number;
//   child_ages: number[] | any;
//   room: number;
// }

export class HotelVendorSearch {
  // Temp for data_lookup
  provider_code?: string;
  vendor_code?: string;

  // Params from FE
  post_id?: number;
  post_code?: string;
  location_code?: string; // maybe city_code
  post_type?: string;
  service_type?: string;
  check_in: Date | string;
  check_out: Date | string;
  room: number;
  adult: number;
  child: number;
  child_ages?: number[] | any;
  request_id?: string;

  currency?: string;

  // Keyword
  keyword?: string;

  // Use for recursive
  next_page?: string;
  search_cache_level?: string;

  // Extend data
  distance?: number;

  // Search Type
  source_type?: string;
}

export class RoomVendorSearch {
  // 1G, 1A
  vendor_code?: string;
  post_code?: string;
  location_city?: string;
  check_in: Date | string;
  check_out: Date | string;
  room: number;
  adult: number;
  child: number;
  child_ages?: number[] | any;
  keyword?: string;
  keyword_hotel?: string;

  availability?: string;
  currency?: string;

  participation_level?: string;

  // number_room?: number;

  // 1A
  // hotel_chain?: string;
  // hotel_code?: string;
  night_count?: number;
  next_page?: string;
}

// 1A
export class EnhancedPricingVendorSearch {
  chain_code: string;
  hotel_code: string;
  hotel_city_code: string;
  hotel_code_context: string;
  rate_plan_code: string;
  meal_plan_code?: string;
  room_type_code: string;
  booking_code: string;
  check_in: Date | string;
  check_out: Date | string;
  room: number;
  adult: number;
  child: number;
  child_ages?: number[] | any;
  session?: {};
}

export class PNRVendorSearch {
  last_req: boolean;
  session: any;
  contact?: any;
  source_of_business: string;
  guest?: any;
  room_count?: number;
}

export class HotelSellVendorSearch {
  originator_id: any;
  booking_code: string;
  session: any;
  BHO: any;
  APE_number: any;
  guarantee_or_deposit: {};
  source_of_business?: string;
}

//1G
export class PaymentTravelPortSearch {
  First: string;
  Last: string;
  PhoneNumber: string;
  Email: string;
  OrderCode: string;
  AdditionalRequest: string; // order.additional_request;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  rooms: number | any;
  RatePlanType: string;
  // Total: string;
  HotelChain: string;
  HotelCode: string;
}

//1G, 1A
export class CardInforSearch {
  TypeGuarantee: string;
  TypeCard: string;
  ExpDate: string;
  Number: string;
  CVV: string;
}

export class OrderHotetCart {
  order_token: string;  
  provider_code: string;
  post_type: string;
  room_id: number;
  room_availability_id: number;
  // search: any;
  // user_id: config.user_id;
  // expired_time: Date | string;
}

export class OrderHotelDetail {
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
  payment_type_name?: string;
  payment_now?: any;
  payment_status: string;
  payment_status_name: string;
  payment_data?: {} | any;
  refund_json?: {} | any;
  status: string;
  status_name: string;
  check_in: Date | string;
  check_out: Date | string;
  number_room: number;
  number_night: number;
  adult: number;
  child: number;
  child_ages: [] | any;
  subtotal?: number;
  payment_fee: number;
  coupon_price?: number;
  discount_price?: number;
  total_price: number;
  currency: string;
  coin_number?: number;
  language?: string;
  created_at?: Date | string;
  payment_at?: Date;
  order_hotel_room: {
    room_availability_id: number;
    booking_code: string; // confirmation_code: string;
    pnr_code: string;
  };
  contact: {
    buyer: number;
    title: string;
    title_name?: string;
    address: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    phone_code: string;
    country: string;
    birthdate?: Date;
    country_name?: string;
  };
  guest: {
    gender: string;
    first_name: string;
    last_name: string;
  };
  hotel: {
    id: number;
    provider_code: string;
    vendor_code: string;
    post_code: string;
    post_title: string;
    location_lat: number;
    location_lng: number;
    location_address: string;
    city_name?: string;
    phone: string;
    fax_number: string;
    thumbnail: string;
    property_type: string;
    location_postcode: string;
    hotel_star: number;
    rating: number;
    checkin_time: string;
    checkout_time: string;
    min_day_booking: number;
    min_day_stay: number;
    policy: string;
    is_featured: string;
    room_availability: {
      id: number | bigint;
      room_id: number;
      // post_type: string;
      post_title: string;
      check_in: Date | string;
      check_out: Date | string;
      cancel_deadline?: any;
      policy?: string;
      breakfast?: boolean | null;
      option_policies?:
        | [
            {
              id: number;
              term_code: string;
              parse_code: string;
              term_name: string;
              term_title: string;
            },
          ]
        | any;
    };
    room_availabilities?: [];
  };
  surcharges?: OrderSurcharge [];
  can_edit: boolean;
  manage_booking: {
    refundable?: boolean;
    reschedulable?: boolean;
    data_correction?: boolean;
    resend_itineraty?: boolean, 
  }
  coupon?: OrderCoupon | any;
  loyalty?: Loyalty | null;
}

export class HotelOrderDetailForSendMail {
  id: number;
  order_token: string;
  sku: string;
  expired_time_session_seconds: number;
  payment_method: string;
  payment_method_name?: string;
  payment_type: string;
  payment_type_name?: string;
  payment_status: string;
  payment_status_name?: string;
  payment_data?: {} | any;
  status: string;
  status_name?: string;
  check_in: Date | string;
  check_out: Date | string;
  number_room: number;
  number_night: number;
  adult: number;
  child: number;
  child_ages: [] | any;
  subtotal?: number;
  payment_fee?: number;
  coupon_price?: number;
  total_price: number;
  currency: string;
  created_at: Date | string;
  order_hotel_room: {
    room_availability_id: number;
    booking_code: string; // confirmation_code: string;
    pnr_code: string;
  };
  contact: {
    buyer: number;
    title: string;
    address: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    phone_number: string;
    country: string;
  };
  guest: {
    gender: string;
    first_name: string;
    last_name: string;
  };
  hotel: {
    id: number;
    provider_code: string;
    vendor_code: string;
    post_code: string;
    post_title: string;
    location_lat: number;
    location_lng: number;
    location_address: string;
    phone: string;
    fax_number: string;
    thumbnail: string;
    property_type: string;
    location_postcode: string;
    hotel_star: number;
    rating: number;
    checkin_time: string;
    checkout_time: string;
    min_day_booking: number;
    min_day_stay: number;
    policy: string;
    is_featured: string;
    room_availability: {
      id: number | bigint;
      room_id: number;
      post_type: string;
      post_title: string;
      check_in: Date | string;
      check_out: Date | string;
      cancel_deadline?: any;
      policy?: string;
      breakfast?: boolean | null;
      number_night: number;
      option_policies?:
        | [
            {
              id: number;
              term_code: string;
              parse_code: string;
              term_name: string;
              term_title: string;
            },
          ]
        | any;
    };
  };
}

export class OrderHotelCheckoutData {
  order_token: string;
  expired_time: string;
  room_id: number;
  room_availability_id: number;
  search: {
    post_id: number;
    check_in: Date | string;
    check_out: Date | string;
    // room: number;
    adult: number;
    child: number;
    child_ages: [];
    rooms: [
      {
        id: number;
      },
    ];
  };
  contact: {
    buyer: number;
    gender: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    phone_code: string;
    country: string;
  };
  guest: {
    gender: string;
    first_name: string;
    last_name: string;
  };
  additional: string;
  // };
  // cart_data: {
  //   check_in: Date | string;
  //   check_out: Date | string;
  //   number_room: number;
  //   adult: number;
  //   children: number;
  //   number_day: number;
  //   rooms: any;
  //   extras: [];
  //   coupon_data: [];
  // };
  // post_id: number;
  // post_type: string;
  // base_price: number;
  // currency_base: string;
  // tax: {
  //   included: string;
  //   percent: number;
  // };
  // coupon: string;
  // coupon_percent: string;
  // coupon_value: string;
  // sub_total: number;
  // extra_price: number;
  // payment_fee: number;
  // total: number;
  // currency: string;
}

export class GroupRoom {
  post_type: string;
  // title: string | any;
  post_title?: string;
  thumbnail: string;
  gallery: string[] | any;
  footage: number | any;
  beds: string[] | any;
  views: string[] | any;
  guest_number: number | any;
  smoking: string | any;
  facilities: string[] | any;
  group_facilities?: string[] | any;
  rooms: Room[];
  reference: boolean;
}

export class RequestIdEncrypt {
  post_id: number;
  post_code: string;
  post_type: string;
  location_lat?: number;
  location_lng?: number;
  check_in: Date | string;
  check_out: Date | string;
  room: number;
  number_night: number;
  adult: number;
  child?: number;
  child_ages?: number[] | [];
  keywordHotel: string;
}
