import type { User, Address } from './auth.types';
import type { Service, ServiceType, GarmentType } from './service.types';
import type { Branch } from './branch.types';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_process'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  service: string | Service;
  serviceType: ServiceType;
  garmentType: GarmentType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isExpress: boolean;
  notes?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy?: string; // ObjectId
  notes?: string;
}

export interface DeliveryProof {
  type: 'photo' | 'otp' | 'signature';
  photoUrl?: string;
  otpCode?: string;
  signature?: string;
  verifiedAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  branch: Branch;
  serviceCategory: string; // Enum
  items: OrderItem[];
  pickupDate: string;
  pickupTimeSlot: string;
  expectedDeliveryDate: string;
  deliveryTimeSlot?: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  pickupRider?: User;
  deliveryRider?: User;
  subtotal: number;
  discount: number;
  discountCode?: string;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistory[];
  isPaid: boolean;
  payment?: { method: string }; // or IPayment ref
  deliveryProof?: DeliveryProof;
  customerNotes?: string;
  internalNotes?: string;
  rating?: number;
  feedback?: string;
  attachments?: string[];
  pickupScreenshots?: string[];
  deliveryScreenshots?: string[];
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemInput {
  service: string;
  serviceType: ServiceType;
  garmentType: GarmentType;
  quantity: number;
  isExpress?: boolean;
  notes?: string;
}

export interface CreateOrderInput {
  branch: string;
  items: CreateOrderItemInput[];
  pickupDate: string;
  pickupTimeSlot: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  customerNotes?: string;
  discountCode?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
}

export interface AssignRiderInput {
  riderId: string;
  type: 'pickup' | 'delivery';
}

export interface RateOrderInput {
  rating: number;
  feedback?: string;
}
