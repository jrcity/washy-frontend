export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'cash';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  _id: string;
  order: string; // ObjectId
  customer: string; // ObjectId
  amount: number;
  amountPaid: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  
  // Paystack
  paystackReference?: string;
  paystackAccessCode?: string;
  paystackAuthorizationUrl?: string;
  paystackTransactionId?: string;

  // Bank Transfer
  bankTransferDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferReference?: string;
  };

  // Refund
  refund?: {
    amount: number;
    reason: string;
    refundedAt: string;
    refundReference?: string;
  };

  metadata?: Record<string, any>;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
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
