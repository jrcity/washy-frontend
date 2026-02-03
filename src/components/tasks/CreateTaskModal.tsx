import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, User, ShoppingBag, Flag, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tasksService } from '@/services/tasks.service';
import { useOrders, useUsers } from '@/hooks';
import { TaskType, TaskPriority, type CreateTaskInput } from '@/types/task.types';
import { Button, Input, Select, Badge, Card } from '@/components/ui';
import { queryKeys } from '@/lib/queryClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultType?: TaskType;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, defaultType }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateTaskInput>({
        defaultValues: {
            type: defaultType || 'pickup',
            priority: 'normal',
            scheduledFor: new Date().toISOString().split('T')[0],
        }
    });

    const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 50, status: 'confirmed' });
    const { data: ridersData, isLoading: ridersLoading } = useUsers({ role: 'rider', limit: 50 });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateTaskInput) => tasksService.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
            toast.success('Task assigned successfully');
            reset();
            onClose();
        },
        onError: () => toast.error('Failed to assign task')
    });

    if (!isOpen) return null;

    const orders = ordersData?.orders || [];
    const riders = ridersData?.users || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-8 border-b border-neutral-50 bg-neutral-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Dispatch Task</h2>
                        <p className="text-sm font-medium text-neutral-500">Assign a new journey to a rider</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all hover:rotate-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit((data) => mutate(data))} className="p-8 space-y-8">
                    {/* Order Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary-600 mb-1">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-widest">Order Reference</span>
                        </div>
                        <Controller
                            name="orderId"
                            control={control}
                            rules={{ required: 'Please select an order' }}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select a confirmed order..."
                                    options={orders.map(o => ({
                                        value: o._id,
                                        label: `${o.orderNumber} — ${o.customer?.name || 'Guest'}`
                                    }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.orderId?.message}
                                    disabled={ordersLoading}
                                />
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Task Type */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary-600 mb-1">
                                <Navigation className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Mission Type</span>
                            </div>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                                        {['pickup', 'delivery'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => field.onChange(type)}
                                                className={cn(
                                                    "py-3 rounded-xl text-xs font-black uppercase transition-all",
                                                    field.value === type
                                                        ? "bg-white text-primary-600 shadow-sm ring-1 ring-neutral-200"
                                                        : "text-neutral-400 hover:text-neutral-600"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary-600 mb-1">
                                <Flag className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Urgency</span>
                            </div>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={[
                                            { value: 'normal', label: 'NORMAL' },
                                            { value: 'medium', label: 'MEDIUM' },
                                            { value: 'high', label: 'HIGH' },
                                            { value: 'critical', label: 'CRITICAL' },
                                        ]}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Rider Assignment */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary-600 mb-1">
                                <User className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Assign Rider</span>
                            </div>
                            <Controller
                                name="assignedTo"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Choose a rider (Auto if left blank)"
                                        options={riders.map(r => ({
                                            value: r._id,
                                            label: r.name
                                        }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={ridersLoading}
                                    />
                                )}
                            />
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary-600 mb-1">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Scheduled For</span>
                            </div>
                            <Input
                                type="date"
                                {...register('scheduledFor', { required: 'Date is required' })}
                                className="h-12 rounded-2xl bg-neutral-50 border-neutral-100 focus:bg-white"
                                error={errors.scheduledFor?.message}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-50 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-bold border-neutral-200"
                            onClick={onClose}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2] h-14 rounded-2xl shadow-xl shadow-primary-200 font-black text-lg"
                            isLoading={isPending}
                        >
                            Dispatch Now
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTaskModal;
