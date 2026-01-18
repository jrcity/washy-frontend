import type { Address } from '@/types/api.types';
import type { User } from '@/types/auth.types';
import type { Branch } from '@/types/branch.types';

// Order Status
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

// Garment Types
export type GarmentType = 
  | 'shirt'
  | 'trouser'
  | 'suit'
  | 'dress'
  | 'duvet'
  | 'curtain'
  | 'bedsheet'
  | 'towel'
  | 'skirt'
  | 'underwear'
  | 'blanket'
  | 'jacket'
  | 'native_attire'
  | 'other';

// Time Slots
export type TimeSlot = 
  | '09:00-12:00'
  | '12:00-15:00'
  | '15:00-18:00'
  | '18:00-21:00';

// Order Item
export interface OrderItem {
  service: string;
  serviceType: string;
  garmentType: GarmentType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isExpress: boolean;
  notes?: string;
}

// Order
export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  branch: Branch;
  items: OrderItem[];
  pickupDate: string;
  pickupTimeSlot: TimeSlot;
  expectedDeliveryDate: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  paymentMethod?: string;
  customerNotes?: string;
  internalNotes?: string;
  pickupRider?: User;
  deliveryRider?: User;
  rating?: number;
  feedback?: string;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

// Create Order Item Input
export interface CreateOrderItemInput {
  serviceId: string;
  garmentType: GarmentType;
  quantity: number;
  isExpress?: boolean;
  notes?: string;
}

// Create Order Input
export interface CreateOrderInput {
  branchId: string;
  items: CreateOrderItemInput[];
  pickupDate: string;
  pickupTimeSlot: TimeSlot;
  pickupAddress: Address;
  deliveryAddress: Address;
  customerNotes?: string;
  discountCode?: string;
}

// Update Order Status Input
export interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
}

// Assign Rider Input
export interface AssignRiderInput {
  riderId: string;
  type: 'pickup' | 'delivery';
}

// Rate Order Input
export interface RateOrderInput {
  rating: number;
  feedback?: string;
}

// Cancel Order Input
export interface CancelOrderInput {
  reason: string;
}

// Order Filters
export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

// Order Stats
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageRating?: number;
}

// Verify Delivery Input
export interface VerifyDeliveryInput {
  type: 'photo' | 'otp_code' | 'signature';
  otpCode?: string;
  photoUrl?: string;
}
