import type { User, Address } from './auth.types';
import type { Service, ServiceType } from './service.types';
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

export type GarmentType = 'shirt' | 'trouser' | 'suit' | 'dress' | 'duvet' | 'curtain' | 'bedsheet' | 'towel' | 'skirt' | 'underwear' | 'blanket' | 'jacket' | 'native_attire' | 'other';

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

export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  branch: Branch;
  items: OrderItem[];
  pickupDate: string;
  pickupTimeSlot: string;
  expectedDeliveryDate: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  driver?: User; 
  pickupRider?: User;
  deliveryRider?: User;
  notes?: string;
  rating?: number;
  payment?: { method: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemInput {
  serviceId: string;
  garmentType: GarmentType;
  quantity: number;
  isExpress?: boolean;
  notes?: string;
}

export interface CreateOrderInput {
  branchId: string;
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
