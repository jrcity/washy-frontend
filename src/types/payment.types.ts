// Payment Methods
export type PaymentMethod = 
  | 'card'
  | 'bank_transfer'
  | 'ussd'
  | 'cash';

// Payment Status
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// Payment
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
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Initialize Payment Input
export interface InitializePaymentInput {
  orderId: string;
  method?: PaymentMethod;
  callbackUrl?: string;
}

// Initialize Payment Response
export interface InitializePaymentResponse {
  payment: Payment;
  authorizationUrl: string;
}

// Record Cash Payment Input
export interface RecordCashPaymentInput {
  orderId: string;
  amount: number;
}

// Payment Filters
export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
}
