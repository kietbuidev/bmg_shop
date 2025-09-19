import {Transform, Type} from 'class-transformer';
import {IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import {errorCodes} from '../../../utils/errorMessage';

export class SearchFlightWayRequest {
  @IsOptional()
  surcharge_token?: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  adult: number;

  @Type(() => Number)
  child?: number = 0;

  @Type(() => Number)
  infant?: number = 0;

  @IsString()
  @IsNotEmpty()
  start_point?: string;

  @IsString()
  @IsNotEmpty()
  end_point: string;
  
  @IsNotEmpty()
  @IsString()
  flight_date: string;

  @IsOptional()
  @IsString()
  airline?: string;

  @IsOptional()
  @IsString()
  ticket_class?: string = 'ALL';

  @IsOptional()
  @IsString()
  keyword?: string;

  // Convert object
  // @Type(() => FlightWay)
  // flight?: FlightWay;

  // filter?: FilterSearch;

  @IsOptional()
  @IsString()
  sort?: string;

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
    return value.trim().split(',');
  })
  airlines?: string[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  start_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  end_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  stops?: number[];

  @IsOptional()
  @IsString()
  dok?: string;
}

export class SearchFlightRequest {
  @IsOptional()
  surcharge_token?: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  adult: number;

  @Type(() => Number)
  child?: number = 0;

  @Type(() => Number)
  infant?: number = 0;

  @IsString()
  @IsNotEmpty()
  start_point?: string;

  @IsString()
  @IsNotEmpty()
  end_point: string;
  
  // @IsNotEmpty()
  // @IsString()
  // flight_date: string;

  @IsNotEmpty()
  @IsString()
  departure: string;

  arrival?: string;

  @IsString()
  @IsNotEmpty()
  step: string;

  @IsOptional()
  @IsString()
  airline?: string;

  @IsOptional()
  @IsString()
  ticket_class?: string = 'ALL';

  @IsOptional()
  @IsString()
  keyword?: string;

  // Convert object
  // @Type(() => FlightWay)
  // flight?: FlightWay;

  // filter?: FilterSearch;

  @IsOptional()
  @IsString()
  sort?: string;

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
    return value.trim().split(',');
  })
  airlines?: string[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  start_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  end_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  stops?: number[];

  @IsOptional()
  @IsString()
  dok?: string;
}

export class SearchFlightWaySurchargeRequest {
  @IsString()
  surcharge_token?: string;

  @Type(() => Number)
  adult?: number;

  @Type(() => Number)
  child?: number = 0;

  @Type(() => Number)
  infant?: number = 0;

  @IsString()
  @IsNotEmpty()
  start_point: string;

  @IsString()
  @IsNotEmpty()
  end_point: string;

  @IsString()
  @IsNotEmpty()
  step: string;

  @IsNotEmpty()
  @IsString()
  flight_date: string;

  @IsOptional()
  @IsString()
  airline?: string;

  @IsOptional()
  @IsString()
  ticket_class?: string = 'ALL';

  @IsOptional()
  @IsString()
  keyword?: string;

  // Convert object
  // @Type(() => FlightWay)
  // flight?: FlightWay;

  // filter?: FilterSearch;

  @IsOptional()
  @IsString()
  sort?: string;

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
    return value.trim().split(',');
  })
  airlines?: string[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  start_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  end_times?: number[];

  @Transform(({value}) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.trim().split(',').map(Number);
  })
  stops?: number[];

   @IsOptional()
  @IsString()
  dok?: string;
}

export class SearchMonthRequest {
  @IsOptional()
  surcharge_token?: string;

  @IsString()
  @IsNotEmpty()
  start_point: string;

  @IsString()
  @IsNotEmpty()
  end_point: string;

  @IsNotEmpty()
  flight_date: string;

  @IsOptional()
  @IsNumber()
  month: number;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  airline?: string; // v1

  // @IsString()
  // @IsNotEmpty()
  @IsOptional()
  step?: string;
}

// export class DetailFlightsRequest {
//   @IsNumber()
//   @IsNotEmpty()
//   adult: number;

//   @IsNumber()
//   child?: number;

//   @IsNumber()
//   infant?: number;

//   @IsNotEmpty()
//   session: string;

//   @IsNotEmpty()
//   flight_value: string;

//   @IsNotEmpty()
//   start_point: string;

//   @IsNotEmpty()
//   end_point: string;

//   @IsNotEmpty()
//   flight_date: string;

//   @IsNotEmpty()
//   ticket_class: string;
// }

export class ContactRequest {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  title_name?: string;

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

  @IsNotEmpty({
    message: errorCodes.REQUIRE_PHONE_CODE,
  })
  @IsString()
  phone_code?: string;

  @IsString()
  phone: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  buyer?: number | any;
}

export class PassengerRequest {
  id: number;

  @IsNotEmpty()
  pax_type: string;

  @IsNotEmpty()
  date_of_birth: Date;

  @IsNotEmpty()
  @Transform(({value}) => {
    return value.trim();
  })
  first_name: string;

  @IsNotEmpty()
  @Transform(({value}) => {
    return value.trim();
  })
  last_name: string;

  @IsNotEmpty()
  title: string;

  // @IsNotEmpty()
  indentity_type?: string;

  @IsNotEmpty()
  nationality?: string;

  identity_number?: string;

  identity_expiry_date?: Date;

  passport_number?: string;

  passport_expiry_date?: Date;

  country_of_issue?: string;

  membership_card_number?: string;
}


export class BaggagesRequest {
  uid: string;
  session: string;
}

export class MealsRequest {
  uid: string;
  session: string;
}

export class SeatsRequest {
  uid: string;
  session: string;
}

export class UpdatePassengerRequest {
  order_token?: string;

  @ValidateNested()
  @Type(() => ContactRequest)
  contact: ContactRequest;

  // @IsArray()
  @ValidateNested()
  @Type(() => PassengerRequest)
  passengers: PassengerRequest[];
}

export class UpdateOptionCommandRequest {
  @IsOptional()
  order_token?: string;

  @IsOptional()
  surcharge_token?: string;
  
  @IsOptional()
  passengers: [
    {
      id: number;
      baggages?: BaggagesRequest[];
      meals?: MealsRequest[];
      seats?: SeatsRequest[];
    },
  ];
}

export class FlightsInfoRequest {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class FindTicketClassRequest {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  adult: number;

  @Type(() => Number)
  child?: number;

  @Type(() => Number)
  infant?: number;

  @IsNotEmpty()
  ticket_class: string;

  @IsNotEmpty()
  airline: string;

  @IsNotEmpty()
  flight_date: string;

  @IsNotEmpty()
  start_point: string;

  @IsNotEmpty()
  end_point: string;

  @IsNotEmpty()
  flight_value: string;

  @IsNotEmpty()
  group_class: string;
}

export class VerifyRequest {
  @IsOptional()
  @IsString()
  order_token?: string;

  // @IsString()
  // provider_code: string;

  @ValidateNested()
  @Type(() => FlightWayVerify)
  flights: {
    departure: FlightWayVerify;
    arrival?: FlightWayVerify;
  };
}

export class VerifySurchargeRequest {
  @IsOptional()
  @IsString()
  surcharge_token?: string;

  @ValidateNested()
  @Type(() => FlightWayVerify)
  flights: {
    departure?: FlightWayVerify;
    arrival?: FlightWayVerify;
  };
}

export class BookRequest {
  @IsOptional()
  @IsString()
  order_token?: string;
  // provider_code: string;
  // @Type(() => FlightVerify)
  // flights: {
  //   departure: FlightVerify;
  //   arrival?: FlightVerify;
  // };
  @IsOptional()
  card?: {
    iv: string;
    data: string;
  };
}

export class FlightWayVerify {
  @ValidateNested()
  option_key: string;
}

export class FareRuleRequest {
  @IsOptional()
  @IsString()
  option_key?: string;
}

export class BaggageRequest {
  session: string;
  airline: string;
  flight_value: string;
  start_point: string;
  end_point: string;
}

export class generateLinkFlightRequest {
  @ValidateNested()
  @Type(() => FlightWayVerify)
  flights: {
    departure?: FlightWayVerify;
    arrival?: FlightWayVerify;
  };

  @IsOptional()
  is_select: boolean
}