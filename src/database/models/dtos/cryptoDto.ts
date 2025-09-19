export class PriceFMCResponse {
  version: string;
  currency: string;
  amount: number;
  currency_name: string;
  // total_coin: number;
  image: string;
}

export class OrderFMCResponse {
  id: number;
  address: string;
  version: string;
  requestid: string;
  currency: string;
  endtime: string;
  fee: number;
  amount: number;
  image: string;
  currency_name: string;
}

export class OrderSurchargeResponse {
  id?: number;
  address?: string;
  version?: string;
  requestid?: string;
  currency: string;
  endtime?: string;
  fee?: number;
  amount: number;
  image?: string;
  currency_name?: string;
  url?: string;
}
