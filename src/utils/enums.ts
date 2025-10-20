export enum EnvType {
  DEVELOPMENT = 'DEVELOPMENT',
  PREVIEW = 'PREVIEW',
  PRODUCTION = 'PRODUCTION',
}

export enum MethodType {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}


export enum RoleType {
  Admin = 1,
  Parner = 2,
  Customer = 3,
  CustomerService = 4,
  Counter = 5,
  Markerting = 6,
  Developer = 7,
}

export enum LocationType {
  Area = 'area',
  Country = 'country',
  City = 'city',
  Airport = 'airport',
  Hotel = 'hotel',
  Room = 'room',
}

export enum MealType {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
  All = 4,
}

export enum SortByType {
  Recommend = 'recommend',
  LowestPrice = 'lowest_price',
  HighestPrice = 'highest_price',
  LowestRank = 'lowest_rank',
  HighestRank = 'highest_rank',
  LowestDistance = 'lowest_distance',
  HighestDistance = 'highest_distance',
  LowestDistanceLocation = 'lowest_distance_location',
  HighestDistanceLocation = 'highest_distance_location',
  TheEarliestFlight = 'the_earliest_flight',
  TheLastedFlight = 'the_lasted_flight',
  TheFastestFlightTime = 'the_fastest_flight_time',
  TheSlowestFlightTime = 'the_slowest_flight_time',
}

export enum StatusActive {
  On = 'on',
  Off = 'off',
}

export enum StatusMulti {
  Publish = 'publish',
  Draft = 'draft',
  Trash = 'trash',
}

export enum ProductStatus {
  NEW = 'NEW',
  BEST_SELLER = 'BEST_SELLER',
  SALE_OFF = 'SALE_OFF',
  NORMAL = 'NORMAL',
}

export enum ContactStatus {
  NEW = 'NEW',
  INPROGRESS = 'INPROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum TrackingStatus {
  Waiting = 'waiting',
  Done = 'done',
  Pricing = 'pricing',
  Faild = 'faild',
  Expired = 'expired',
}

export enum ConfigDefault {
  language = 'en',
  currency = 'USD',
  country = 'vn',
  tenant = 'FMT',
}

export enum CurrencyUnit {
  VND = 'VND',
  USD = 'USD',
}

export enum Limit {
  Hotel = 10,
}

export enum WhyChooseHeyotrip {
  On = 'on',
  Off = 'off',
}


export enum TimeOut {
  EXPIRED_TIME_SECONDS = 890, // sescond == 14:50 minute
}

export enum PaymentTypeCode {
  GUARANTEE = 1,
  PREPAYMENT = 2, //or Deposit
}

export enum PaymentMethod {
  FMC_PAY = 'fmcpay',
  APPOTA_PAY = 'appotapay',
  CREDIT_CARD = 'creditcard',
  POSTPAID = 'postpaid',
}

export enum StatusSendEmail {
  SUCESSS = 1,
  FAILURE = 0,
}

export enum CustomerStatus {
  DELETE = 0,
  INACTIVE = 1,
  ACTIVE = 2,
}

export enum CustomerType {
  WEB = 1,
  FB = 2,
  GG = 3,
  INCOGNITO = 4, // Visiting customers are not logged in
  APPL = 5,
}

export enum StatusActived {
  STATUS_ACTIVED = 2,
}

export enum CouponType {
  Special = 'special',
  Promotion = 'promotion',
  Unique = 'unique',
  Partner = 'partner',
}

export enum HotelTravelPortMedia {
  SizeCode = 'E',
  Xmlns = 'http://www.travelport.com/schema/common_v50_0',
}

export enum HotelTravelPortDescription {
  KeywordNameDESC = 'DESC',
  KeywordNameCANC = 'CANC',
}

export enum SubdirectoryTravelPort {
  HotelService = 'HotelService',
  GdsQueueService = 'GdsQueueService',
  FlightService = 'AirService',
}

export enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}



export enum PropertyTypeNumber {
  Hotel = '20',
}

export enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum HTTPCode {
  SUCCESS = 200,
  CHANGE_VALUE = 303,
  REQUIRED = 400,
  INVALID = 400,
  BAD_REQUEST = 400,
  UNAUTHORIZE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  EXPIRED = 408,
  ERROR_CONFLICT = 400, //409,
  CAN_NOT_PERFORMED = 400, //422,
}


export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UploadImageType {
  CATEGORIES = 'categories',
  POSTS = 'posts',
  PRODUCTS = 'products',
}

export enum Title {
  MR = 'mr',
  MRS = 'mrs',
  MS = 'ms',
}

export enum FlightWayType {
  DEPARTURE = 'departure',
  ARRIVAL = 'arrival',
  // DOMESTIC = 0,
  // INTERNATIONAL = 1,
}

export enum CacheExpTimeFlight {
  SEARCH = 1800, // (30 minute)
  RULE = 1800,
  ADDON = 900,
}

// export enum AgeGroup {
//   ADULT = 1,
//   CHILDREN = 2,
//   INFANT = 3,
// }

export enum PaxType {
  ADULT = 'ADT',
  CHILD = 'CHD',
  INFANT = 'INF',
}

export enum ExpiredBookingFlightClient {
  Client = 0.25, // (15/60) = 0.25 (minute)
}

export enum ExpiredBookingHotelClient {
  Client = 900, // second == (15 minutes)
}

export enum ExpiredBookingFlightAdmin {
  OVER24H = 3.5,
  SMALL24H = 0.8, // 45 minute
}

export enum ExpiredBookingHotelAdmin {
  TVP = 12600, // second == (210 minutes) == 3.5 hours
  AMADEUS = 850, // second == (14 minutes)
}

export enum ScheduleType {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export enum EventType {
  EMAIL = 'Email',
  NOTIFICATION = 'Notification',
}

export enum PostType {
  ORDER = 'Order',
  ORDER_SURCHARGE = 'OrderSurcharge',
}

export enum CouponStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  Expired = 'Expired',
  Deactivate = 'Deactivate',
}

export enum DiscountType {
  PERCENT = 'on',
  FIXED = 'off',
}

export enum SocialType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum ConvertPrice {
  CURRENCYTOCRYPTO = 'CurrencyToCrypto',
  CURRENCYTOCURRENCY = 'CurrencyToCurrency',
  CRYPTOTOCURRENCY = 'CryptoToCurrency',
}

export enum IndentityType {
  PASSPORT = 'passport',
  IDENTITY = 'identity',
}

export enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
}

export enum BaggageType {
  CARRY_ON_BAGGAGE = 'carry-on-baggage',
  CHECKED_BAGGAGE = 'checked-baggage',
}

export enum FareServices {
  CARRY_ON_BAGGAGE = 'carry-on-baggage',
  CHECKED_BAGGAGE = 'checked-baggage',
  TICKET_REFUND = 'ticket-refund',
  TICKET_CHANGE = 'ticket-change',
  MEAL = 'meal',
}

export enum RetrieveBookingStatusHPL {
  TICKETED = 'TICKETED',
  OK = 'OK',
}

export enum TypeHotelUpdate {
  ATTRACTIONS = 'attractions',
  CONVERT_IMAGE = 'convert-image',
  CHECK_IMAGE = 'check-image',
  STAR = 'star',
  ROOM_TYPE = 'room-type',
  THUMBNAIL = 'thumbnail',
}

export enum HotelMediaPostType {
  HOTEL = 'hotel',
  ROOM = 'room',
  ROOM_TYPE = 'room_type',
}

export enum AppotapayPaymentMethod {
  ATM = 'ATM', //Thanh toán qua iBanking/thẻ ATM
  CC = 'CC', //Thanh toán qua thẻ Visa/Master Card/JCB
  EWALLET = 'EWALLET', //Thanh toán qua Ví điện tử
  MM = 'MM', //Mobile Money
  VA = 'VA', // Thu Hộ qua tài khoản ảo
}

export enum FolderName {
  CONTACT = 'contact',
  AVATAR = 'avatar',
}

export enum OrderSurchargeType {
  ADDON = 'addon',
  RESCHEDULE = 'reschedule',
  REFUNDABLE = 'refundable',
  ORTHER = 'orther',
}

export enum OrderSurchargeActor {
  BUYER = 'Buyer',
  SYSTEM = 'System',
  ORTHER = 'Other',
}

export enum TypeCoin {
  IN = 'in',
  OUT = 'out',
}

export enum LoyaltyType {
  REGISTER = 'Register',
  FLIGHT = 'Flight',
  HOTEL = 'Hotel'
}

export enum TierTypeDefault {
  CURRENT_TIER = 1,
  NEXT_TIER = 2,
}

export enum OrderNotificationType {
  FLIGHT_CONFIRMED = "flightConfirmed",
  HOTEL_CONFIRMED = "hotelConfirmed",
}

export enum eventType {
  LOCATION = 'location',
  NEW_FUNCTION = 'new_function',
  COUPON = 'coupon'
}

export enum NotificationType {
  ORDER = 'Order',
  SURCHARGE = 'Surcharge',
  SUPPORT = 'Support',
  EVENT = 'Event',
  CREATED = 'Created',
  COUPON = 'Coupon'
}

export enum ShareType {
  POST = 'Post',
  HOTEL = 'Hotel',
  FLIGHT = 'FLIGHT',
}
