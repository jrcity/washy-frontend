import { useNavigate, useParams } from 'react-router-dom';
import {
    Package, MapPin, Phone, User, Clock,
    ArrowLeft, ChefHat, PlayCircle, Truck
} from 'lucide-react';
import { useOrder, useUsers, useAssignRider } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen, Select } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from '@/lib/utils';
import type { OrderItem } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const BranchOrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading } = useOrder(id!);

    if (isLoading) return <LoadingScreen />;
    if (!order) return <div className="text-center py-12">Order not found</div>;

    return (
        <PageWrapper
            title={`Order #${order.orderNumber}`}
            description="View order details and status"
            action={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/branch/orders')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Button>
                    <Button
                        onClick={() => navigate(`/branch/orders/${order._id}/process`)}
                        leftIcon={<PlayCircle className="w-4 h-4" />}
                    >
                        Process Order
                    </Button>
                </div>
            }
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Summary */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Package className="w-5 h-5 text-neutral-500" />
                                Order Items
                            </h3>
                            <Badge className={`${getStatusColor(order.status)} text-sm py-1 px-3`}>
                                {getStatusText(order.status)}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item: OrderItem, idx: number) => (
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
                                                <p className="text-xs text-warning-600 mt-1">Note: {item.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-bold text-neutral-900">{formatCurrency(item.subtotal)}</p>
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-neutral-500" />
                            Customer
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                    {order.customer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">{order.customer.name}</p>
                                    <p className="text-sm text-neutral-500">{order.customer.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Customer
                            </Button>
                        </div>
                    </Card>

                    {/* Locations */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            Locations
                        </h3>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-neutral-200"></div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
                                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                </div>
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pickup</p>
                                <p className="text-sm text-neutral-900">{order.pickupAddress.street}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(order.pickupDate, 'PP')} • {order.pickupTimeSlot}
                                </div>
                            </div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
                                    <div className="w-2 h-2 rounded-full bg-success-500"></div>
                                </div>
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Delivery</p>
                                <p className="text-sm text-neutral-900">{order.deliveryAddress.street}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                                    <Clock className="w-3 h-3" />
                                    Est. {formatDate(order.expectedDeliveryDate, 'PP')}
                                </div>
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
                            <div>
                                <p className="text-sm text-neutral-500 mb-2">Pickup Rider</p>
                                {order.pickupRider ? (
                                    <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border">
                                        <p className="text-sm font-medium">{typeof order.pickupRider === 'object' ? (order.pickupRider as any).name : 'Rider Assigned'}</p>
                                    </div>
                                ) : (
                                    <RiderSelector orderId={order._id} type="pickup" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 mb-2">Delivery Rider</p>
                                {order.deliveryRider ? (
                                    <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border">
                                        <p className="text-sm font-medium">{typeof order.deliveryRider === 'object' ? (order.deliveryRider as any).name : 'Rider Assigned'}</p>
                                    </div>
                                ) : (
                                    <RiderSelector orderId={order._id} type="delivery" />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

const RiderSelector = ({ orderId, type }: { orderId: string, type: 'pickup' | 'delivery' }) => {
    const [selectedRider, setSelectedRider] = useState('');
    const { data: ridersData, isLoading } = useUsers({ role: 'rider', limit: 100 });
    const { mutate: assignRider, isPending } = useAssignRider();

    const handleAssign = () => {
        if (!selectedRider) return;
        assignRider({
            id: orderId,
            data: { riderId: selectedRider, type }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                placeholder="Select..."
                disabled={isLoading || isPending}
                className="flex-1 h-9 text-xs"
                options={ridersData?.users.map(u => ({
                    value: u._id,
                    label: u.name
                })) || []}
            />
            <Button size="sm" onClick={handleAssign} disabled={!selectedRider} isLoading={isPending} className="h-9 px-3">
                Assign
            </Button>
        </div>
    );
};
