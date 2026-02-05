import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Package, MapPin, Phone, User, Clock,
    CheckCircle, Truck, AlertTriangle, ArrowLeft,
    CreditCard, Calendar
} from 'lucide-react';
import { useOrder, useUpdateOrderStatus, useUsers, useAssignRider } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen, Select } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { useState } from 'react';

export const AdminOrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading } = useOrder(id!);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

    if (isLoading) return <LoadingScreen />;
    if (!order) return <div className="text-center py-12">Order not found</div>;

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        updateStatus(
            { id: order._id, data: { status: newStatus } },
            { onSuccess: () => setSelectedStatus('') }
        );
    };

    const statusOptions: { value: OrderStatus; label: string }[] = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'picked_up', label: 'Picked Up' },
        { value: 'in_process', label: 'In Process' },
        { value: 'ready', label: 'Ready' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <PageWrapper
            title={`Order #${order.orderNumber}`}
            description="View and manage order details"
            showBack={true}
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Management */}
                    <Card className="p-6 border-primary-100 bg-primary-50/30">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                            Order Status
                        </h3>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full">
                                <p className="text-sm text-neutral-500 mb-1">Current Status</p>
                                <Badge className={`${getStatusColor(order.status)} text-base py-1 px-3`}>
                                    {getStatusText(order.status)}
                                </Badge>
                            </div>

                            <div className="flex items-end gap-2 w-full md:w-auto">
                                <div className="w-full md:w-48">
                                    <p className="text-sm text-neutral-500 mb-1">Update to</p>
                                    <Select
                                        value={selectedStatus}
                                        onChange={(e) => {
                                            if (e.target.value) handleStatusUpdate(e.target.value as OrderStatus);
                                        }}
                                        disabled={isUpdating}
                                        options={[
                                            { value: "", label: "Select Action..." },
                                            ...statusOptions.map(opt => ({
                                                ...opt,
                                                disabled: opt.value === order.status
                                            }))
                                        ]}
                                        className="h-10 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Order Items */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-neutral-500" />
                            Order Items
                        </h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-semibold text-neutral-600">
                                            {item.quantity}
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900">
                                                {typeof item.service === 'string' ? 'Service' : item.service.name}
                                            </p>
                                            <p className="text-sm text-neutral-500 capitalize">{item.garmentType}</p>
                                            {item.notes && (
                                                <p className="text-xs text-warning-600 mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Note: {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-medium text-neutral-900">{formatCurrency(item.subtotal)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-neutral-100 mt-6 pt-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-neutral-500" />
                            Payment Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <p className="text-sm text-neutral-500">Payment Status</p>
                                <Badge variant={order.isPaid ? 'success' : 'warning'} className="mt-1">
                                    {order.isPaid ? 'PAID' : 'UNPAID'}
                                </Badge>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <p className="text-sm text-neutral-500">Payment Method</p>
                                <p className="font-medium text-neutral-900 capitalize mt-1">
                                    {order.payment?.method || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-neutral-500" />
                            Customer
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                {order.customer.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-neutral-900">{order.customer.name}</p>
                                <p className="text-sm text-neutral-500">{order.customer.email}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Customer
                        </Button>
                    </Card>

                    {/* Branch Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            Branch
                        </h3>
                        <p className="font-medium text-neutral-900">{order.branch.name}</p>
                        <p className="text-sm text-neutral-500">{order.branch.code}</p>
                    </Card>

                    {/* Dates */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            Timeline
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Created</span>
                                <span className="text-neutral-900">{formatDate(order.createdAt, 'PPp')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Pickup Date</span>
                                <span className="text-neutral-900">{formatDate(order.pickupDate, 'PP')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Expected Delivery</span>
                                <span className="text-neutral-900">{formatDate(order.expectedDeliveryDate, 'PP')}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Rider Assignment */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-neutral-500" />
                            Logistics
                        </h3>

                        <div className="space-y-4">
                            {/* Pickup Rider */}
                            <div>
                                <p className="text-sm text-neutral-500 mb-2">Pickup Rider</p>
                                {order.pickupRider ? (
                                    <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {typeof order.pickupRider === 'object' ? (order.pickupRider as any).name : 'Rider Assigned'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <RiderSelector
                                        orderId={order._id}
                                        type="pickup"
                                        onAssigned={() => { }}
                                    />
                                )}
                            </div>

                            {/* Delivery Rider */}
                            <div>
                                <p className="text-sm text-neutral-500 mb-2">Delivery Rider</p>
                                {order.deliveryRider ? (
                                    <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {typeof order.deliveryRider === 'object' ? (order.deliveryRider as any).name : 'Rider Assigned'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <RiderSelector
                                        orderId={order._id}
                                        type="delivery"
                                        onAssigned={() => { }}
                                    />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

const RiderSelector = ({ orderId, type, onAssigned }: { orderId: string, type: 'pickup' | 'delivery', onAssigned: () => void }) => {
    const [selectedRider, setSelectedRider] = useState('');
    const { data: ridersData, isLoading } = useUsers({ role: 'rider', limit: 100 });
    const { mutate: assignRider, isPending } = useAssignRider();

    const handleAssign = () => {
        if (!selectedRider) return;
        assignRider({
            id: orderId,
            data: { riderId: selectedRider, type }
        }, {
            onSuccess: () => {
                onAssigned();
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                placeholder="Assign rider..."
                disabled={isLoading || isPending}
                className="flex-1 h-9 text-xs"
                options={ridersData?.users.map(u => ({
                    value: u._id,
                    label: u.name
                })) || []}
            />
            <Button
                size="sm"
                onClick={handleAssign}
                disabled={!selectedRider || isPending}
                isLoading={isPending}
                className="h-9 px-3"
            >
                Assign
            </Button>
        </div>
    );
};

export default AdminOrderDetailsPage;
