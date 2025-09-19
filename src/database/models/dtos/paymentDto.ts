export class PaymentData {
  address?: string;
  toaddress: string;
  version: string;
  agencyid: string;
  requestid: string | number;
  amount: string | number | any;
  currency: string;
  endtime: string | Date;
  fee: string | number;
  id: string | number;
  tax_payment_fmc: number;
  status: string | number;
  receiver?: string | number;
  bank_code?: string;
  account_number?: string | number;
  message?: string;
}

export class buildPaymentAppotaDto {
  total: number;
  currency: string;
  bank_code: string;
  payment_method: string;
  extra_data: string;
  bill_expiry_time?: number;
  description: string;
  order_info: OrderInfo;
  language: string;
}

export class OrderInfo {
  id: number;
  order_token: string;
  post_type: string;
}

export class closeEbillDto {
  account_no: string;
  transaction_id: number;
}