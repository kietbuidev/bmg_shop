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

export enum CacheKeys {
  // Global
  Option = 'heyo_option',
  Language = 'heyo_language',
  Currency = 'heyo_curency',
  Country = 'heyo_country',
  CurrencyExchange = 'heyo_curency_exchange',
  Crypto = 'heyo_crypto',
  Term = 'heyo_term',
  Location = 'heyo_location',
  Area = 'heyo_area',
  City = 'heyo_city',
  Airport = 'heyo_airport',
  Hotel = 'heyo_hotel',
  HotelAvailability = 'heyo_hotel_availability',
  Room = 'heyo_room',
  RoomAvailability = 'heyo_room_availability',
  Flight = 'heyo_flight',
  Page = 'heyo_page',
  Post = 'heyo_post',
  PostCategory = 'heyo_post_category',
  Coupon = 'heyo_coupon',
  Aircraft = 'heyo_aircraft',
  Airline = 'heyo_airline',
  Airplane = 'heyo_airplane',
  Faq = 'heyo_faq',
  CoinRewards = 'heyo_coin_rewards',
  Tier = 'heyo_tier',
  // Session
  Order = 'session_order',
  FlightSession = 'session_flight',
  BaggageSession = 'session_baggage',
  MealSession = 'session_meal',
  SeatSession = 'session_seat',
  OptionService = 'option_service',
}

export enum Tenant {
  HYT = 'HYT',
  FMT = 'FMT',
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

export enum ProviderCode {
  HEYO = 'HEYO',
  // Service
  TRAVELPORT = '1G',
  AMADEUS = '1A',
  HOPHILONG = 'HPL',
  // Payment
  FMCPAY = 'FMCPay',
  APPOTAPAY = 'AppotaPay',
  STRIPE = 'Stripe',
}

export enum TimeOut {
  EXPIRED_TIME_SECONDS = 890, // sescond == 14:50 minute
}

export enum ServiceType {
  HOTEL = 'hotel',
  HOTEL_AVAILIBILITY = 'hotel availibility',
  HOTEL_AVAILIBILITY_OPTION = 'hotel availibility option',
  FLIGHT = 'flight',
  POST = 'post',
  ACCOUNT = 'account'
}

export enum SourceType {
  CRONJOB_HOTEL_AVAILIBILITY = 'cronjob_hotel availibility',
  SEARCH_HOTEL_AVAILIBILITY = 'search_hotel availibility',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export enum PaymentType {
  PREPAYMENT = 'prepayment',
  DEPOSIT = 'deposit',
  GUARANTEE = 'guarantee',
  NOGUARANTEE = 'noguarantee',
}

export enum PaymentTypeCode {
  GUARANTEE = 1,
  PREPAYMENT = 2, //or Deposit
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAY_AT_PROPERTY = 'pay_at_property',
  PAID = 'paid',
  FAILED = 'failed',
  EXPIRED = 'expired',
  TRANSFERRED = 'transferred',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
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

export enum MailCcBooking {
  HOTEL = 'Hotel@Heyotrip.com',
  FLIGHT = 'Flight@Heyotrip.com',
  SUPPORT = 'support@heyotrip.com',
  SERVICE = 'customerservice@heyotrip.com',
  DEVELOP = 'developer@heyotrip.com'
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

export enum DefaultStatus {
  ACTIVE = 2,
  BLOCK = 1,
  DELETE = 0,
}

export enum CouponTypeCode {
  SpecialCampaign = 1,
  PromotionCode = 2,
}

export enum CouponType {
  Special = 'special',
  Promotion = 'promotion',
  Unique = 'unique',
  Partner = 'partner',
}

export enum TicketStatus {
  NotIssued = 'NotIssued',
  Ticketing = 'Ticketing',
}

export enum HotelTravelPort {
  Hot = 'http://www.travelport.com/schema/hotel_v50_0',
  Com = 'http://www.travelport.com/schema/common_v50_0',
  Univ = 'http://www.travelport.com/schema/universal_v50_0',
  Hotel = 'http://www.travelport.com/schema/hotel_v50_0',
  Xmlns = 'http://www.travelport.com/schema/hotel_v50_0',
  Gds = 'http://www.travelport.com/schema/gdsQueue_v50_0',
  OriginApplication = 'UAPI',
  SoapEnv = 'http://schemas.xmlsoap.org/soap/envelope/',
  ProviderCode = '1G',
  AvailableHotelsOnly = 'true',
  ReturnAmenities = 'true',
  LocationType = 'Airport',
  DistanceValue = 1,
  DistanceUnits = 'KM',
  RateRuleDetail = 'Complete',
  PreferredCurrency = 'VND',
  AgeChild = 7,
  TravelerType = 'ADT',
}

export enum FlightTravelPort {
  XmlnsSoapenv = 'http://schemas.xmlsoap.org/soap/envelope/',
  LowFareSearchReqXmlns = 'http://www.travelport.com/schema/air_v42_0',
  Xmlns = 'http://www.travelport.com/schema/common_v42_0',
  Univ = 'http://www.travelport.com/schema/universal_v42_0',
  Air = 'http://www.travelport.com/schema/air_v42_0',
  Com = 'http://www.travelport.com/schema/common_v42_0',
  Gds = 'http://www.travelport.com/schema/gdsQueue_v42_0',
  OriginApplication = 'UAPI',
  Adult = 'ADT',
  Children = 'CNN',
  Infant = 'INF',
  QueueSelector = 61,
  TraceId = 'trace',
}

export enum FlightHoPhiLong {
  language = 'vi',
}

export enum HotelTravelPortReservationQueue {
  TraceId = 'trace',
  QueueSelector = 67,
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

// export enum SubdirectoryAmadeus {
//   ActionDetail = 'OTA_HotelDescriptiveInfoRQ_07.1_1A2007A',
//   ActionSearch = 'Hotel_MultiSingleAvailability_10.0',
//   ActionEnhancedPricing = 'Hotel_EnhancedPricing_2.0',
//   ActionPNR = 'PNRADD_21_1_1A',
//   ActionSell = 'HBKRCQ_20_1_1A',
//   SignOut = 'VLSSOQ_04_1_1A',
// }

export enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HotelAmadeus {
  XmlnsSoapenv = 'http://schemas.xmlsoap.org/soap/envelope/',
  XmlnsSec = 'http://xml.amadeus.com/2010/06/Security_v1',
  XmlnsTyp = 'http://xml.amadeus.com/2010/06/Types_v1',
  XmlnsApp = 'http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3',
  XmlnsSes = 'http://xml.amadeus.com/2010/06/Session_v3',
  XmlnsLink = 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
  XmlnsVls = 'http://xml.amadeus.com/VLSSOQ_04_1',
  XmlnsIat = 'http://www.iata.org/IATA/2007/00/IATA2010.1',
  XmlnsAdd = 'http://www.w3.org/2005/08/addressing',
  XmlnsOas = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
  XmlnsOas1 = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
  Oas1Id = 'UsernameToken-1',
  EncodingType = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
  OasPasswordType = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
  AMA_SecurityHostedUserXmlns = 'http://xml.amadeus.com/2010/06/Security_v1',
  XmlnsAwsse = 'http://xml.amadeus.com/2010/06/Session_v3',
  XmlnsHotelSell = 'http://xml.amadeus.com/HBKRCQ_20_1_1A',
}

export enum SearchCacheLevelAmadeus {
  VeryRecent = 'VeryRecent',
  LessRecent = 'LessRecent',
  Live = 'Live',
}

export enum EchoTokenAmadeus {
  MultiSingle = 'MultiSingle',
  Pricing = 'Pricing',
  WithParsing = 'WithParsing',
  PartialWithParsing = 'PartialWithParsing',
}

export enum RoomPolicies {
  MealIncluded = 'meal_included',
  Refundable = 'refundable',
  CancelDeadline = 'cancel_deadline',
  PayNow = 'pay_now',
  PayAtProperty = 'pay_at_property',
  NoCard = 'no_card',
  // Smoking = 'smoking',
}

export enum TaxonomyType {
  PostCategory = 1,
  PostTag = 2,
  PropertyType = 3,
  HotelFacilities = 4,
  HotelServices = 5,
  RoomFacilities = 6,
  RoomViews = 7,
  RoomBeds = 8,
  RoomMeals = 9,
  RoomPolicies = 10,
  Tile = 11,
  Gender = 12,
  PaymentMethod = 13,
  paymentStatus = 14,
  OrderStatus = 15,
  RoomTypes = 16,
  Transits = 17,
  CabinClass = 18,
  PaymentType = 19,
  FAQCategories = 20,
  ClassTypes = 21,
  FareRule = 22,
  CustomerGroup = 23, // API not used
  ManageCache = 24, // API not used
  ContactCategory = 25,
  ContactType = 26,
  PictureCategory = 27,
  MeetingRoom = 28,
  Restaurants = 29,
  SegmentCategory = 30,
  SecurityCode = 31,
  GuestRoomInfo = 32,
  AdditionalDetail = 33,
  AttractionCategories = 34,
  IndexPoint = 35,
  PaymentCodes = 36,
  Perks = 37,
  FAQTags = 38,
  EventType = 39,
}

export enum PropertyType {
  Hotel = 'hotel',
  Condo = 'condo',
  Villa = 'villa',
  Guesthouse = 'guesthouse',
  Apartment = 'apartment',
  Resort = 'resort',
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
  // VERIFY_ERROR = 304, //304,
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

export enum HeyoCountry {
  VIET_NAM = 'VN',
}

export enum FlightWayStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  BOOKED = 'booked',
  ISSUED = 'issued',
  FAILD = 'faild',
  CANCELLED = 'cancelled',
}

export enum HotelRoomStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  BOOKED = 'booked',
  ISSUED = 'issued',
  FAILD = 'faild',
  CANCELLED = 'cancelled',
}

export enum PacipicFlightNumber {
  CODE = 'VN6',
  LENGTH = 6,
}

export enum StripeTypeGuarantee {
  DEPOSIT = 'Deposit',
  GUARANTEE = 'Guarantee',
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

export enum FlightType {
  DOMESTIC = 0,
  INTERNATIONAL = 1,
}

export enum RoomAvailabilityBooked {
  SELECT = 0,
  // HOLD = 0,
  BOOKED = 1,
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
