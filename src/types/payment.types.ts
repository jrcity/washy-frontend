export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'cash';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  _id: string;
  order: string;
  customer: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paystackReference?: string;
  paystackAuthorizationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitializePaymentInput {
  orderId: string;
  method: Exclude<PaymentMethod, 'cash'>;
  callbackUrl?: string;
}

export interface RecordCashPaymentInput {
  orderId: string;
  amount: number;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
}

export interface InitializePaymentResponse {
  authorizationUrl: string;
  reference: string;
  accessCode?: string;
}
