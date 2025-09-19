export class CreateBillRequest {
  id: 'tok_1OR9ZpHVMXwgUYqipwezlkoH';
  object: 'token';
  card: {
    id: 'card_1OR9ZoHVMXwgUYqi9yWwG0tL';
    object: 'card';
    address_city: null;
    address_country: null;
    address_line1: null;
    address_line1_check: null;
    address_line2: null;
    address_state: null;
    address_zip: null;
    address_zip_check: null;
    brand: '';
    country: 'US';
    cvc_check: 'unchecked';
    dynamic_last4: null;
    exp_month: 11;
    exp_year: 2024;
    funding: 'credit';
    last4: '4242';
    name: null;
    tokenization_method: null;
    wallet: null;
  };
  client_ip: '125.235.234.244';
  created: 1703493117;
  livemode: false;
  type: 'card';
  used: false;
}

export const PaymentMethodPesponse = {
  id: 'pm_1ORA3CHVMXwgUYqiRJiC88GN',
  object: 'payment_method',
  billing_details: {
    address: {
      city: null,
      country: null,
      line1: null,
      line2: null,
      postal_code: null,
      state: null,
    },
    email: null,
    name: null,
    phone: null,
  },
  card: {
    brand: 'visa',
    checks: {
      address_line1_check: null,
      address_postal_code_check: null,
      cvc_check: 'unchecked',
    },
    country: 'US',
    exp_month: 11,
    exp_year: 2024,
    fingerprint: 'DIeFyplVheZbpngX',
    funding: 'credit',
    generated_from: null,
    last4: '4242',
    networks: {available: [], preferred: null},
    three_d_secure_usage: {supported: true},
    wallet: null,
  },
  created: 1703494938,
  customer: null,
  livemode: false,
  metadata: {},
  type: 'card',
};

export class PaymentIntentStripeData {
  amount: number;
  currency: string;
  customer: string;
  automatic_payment_methods: {
    enabled: boolean;
    allow_redirects: string;
  };
  payment_method?: string;
  payment_method_options: {
    card: {
      request_three_d_secure: string;
    };
  };
  metadata: {
    order_id: number;
    order_code: string;
    customer_id: string;
  };
  shipping: {
    address: {
      state: string;
    };
    name: string;
    phone: string;
  };
}
