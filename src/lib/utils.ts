import { format, formatDistance, parseISO, isValid } from 'date-fns';
import type { OrderStatus } from '@/types';

/**
 * Format currency in Nigerian Naira
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateString: string, formatStr = 'PPP'): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : dateString;
  } catch {
    return dateString;
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? formatDistance(date, new Date(), { addSuffix: true }) : dateString;
  } catch {
    return dateString;
  }
};

/**
 * Format time slot to readable format
 */
export const formatTimeSlot = (slot: string): string => {
  const [start, end] = slot.split('-');
  return `${start} - ${end}`;
};

/**
 * Get order status color class
 */
export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    picked_up: 'badge-info',
    in_process: 'badge-primary',
    ready: 'badge-success',
    out_for_delivery: 'badge-info',
    delivered: 'badge-success',
    completed: 'badge-success',
    cancelled: 'badge-error',
  };
  return colors[status] || 'badge-primary';
};

/**
 * Get order status display text
 */
export const getStatusText = (status: OrderStatus): string => {
  const texts: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    picked_up: 'Picked Up',
    in_process: 'In Process',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format Nigerian number
  if (digits.startsWith('234')) {
    const local = digits.slice(3);
    return `+234 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }
  
  return phone;
};

/**
 * Delay utility for async operations
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Check if running in development mode
 */
export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Class name utility (similar to clsx)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
