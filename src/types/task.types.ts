import type { User } from './auth.types';

export type TaskType = 'pickup' | 'delivery' | 'other';
export const TaskType = {
    PICKUP: 'pickup' as TaskType,
    DELIVERY: 'delivery' as TaskType,
    OTHER: 'other' as TaskType,
};

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export const TaskStatus = {
    PENDING: 'pending' as TaskStatus,
    ASSIGNED: 'assigned' as TaskStatus,
    IN_PROGRESS: 'in_progress' as TaskStatus,
    COMPLETED: 'completed' as TaskStatus,
    FAILED: 'failed' as TaskStatus,
    CANCELLED: 'cancelled' as TaskStatus,
};

export type TaskPriority = 'normal' | 'medium' | 'high' | 'critical';
export const TaskPriority = {
    NORMAL: 'normal' as TaskPriority,
    MEDIUM: 'medium' as TaskPriority,
    HIGH: 'high' as TaskPriority,
    CRITICAL: 'critical' as TaskPriority,
};

export interface TaskAddress {
    street: string;
    area: string;
    city: string;
    state: string;
    landmark?: string;
}

export interface TaskOrder {
    _id: string;
    customer: string | User;
    total: number;
    status: string;
    orderNumber: string;
    pickupAddress?: TaskAddress;
    deliveryAddress?: TaskAddress;
}

export interface TaskBranch {
    _id: string;
    name: string;
    code: string;
}

export interface Task {
    _id: string;
    address: TaskAddress;
    order: TaskOrder;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: string | Partial<User>;
    assignedBy?: string | Partial<User>;
    branch: TaskBranch;
    scheduledFor: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    orderId: string;
    type: TaskType;
    priority: TaskPriority;
    scheduledFor: string;
    assignedTo?: string;
}

export interface AssignTaskInput {
    riderId: string;
}
