import { useNavigate, useParams } from 'react-router-dom';
import {
    Package, MapPin, Phone, User, Clock,
    ArrowLeft, ChefHat, PlayCircle, Truck, AlertCircle
} from 'lucide-react';
import { useOrder, useUsers, useAssignRider } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen, Select } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate, cn } from '@/lib/utils';
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
            title={`Order Analysis`}
            description={`Operational dossier for manifest #${order.orderNumber}`}
            showBack={true}
            action={
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="rounded-2xl h-12 font-black border-border bg-card shadow-sm"
                        onClick={() => navigate(`/branch/orders`)}
                    >
                        Back to Fleet
                    </Button>
                    <Button
                        onClick={() => navigate(`/branch/orders/${order._id}/process`)}
                        className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20"
                        leftIcon={<PlayCircle className="w-5 h-5" />}
                    >
                        Process Manifest
                    </Button>
                </div>
            }
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Summary */}
                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-2xl text-primary">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground tracking-tight">Cargo Manifest</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verified Item Inventory</p>
                                </div>
                            </div>
                            <Badge className={cn("rounded-full px-4 py-1.5 font-black italic uppercase text-[10px] tracking-widest border-none shadow-sm", getStatusColor(order.status))}>
                                {getStatusText(order.status)}
                            </Badge>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {order.items.map((item: OrderItem, idx: number) => (
                                <div key={idx} className="group flex justify-between items-center py-5 border-b border-border last:border-0 hover:bg-muted/30 -mx-8 px-8 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center font-black text-muted-foreground shadow-inner group-hover:scale-110 transition-transform">
                                            {item.quantity}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground italic uppercase text-sm tracking-tight">
                                                {typeof item.service === 'string' ? 'Service' : item.service.name}
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">{item.garmentType}</p>
                                            {item.notes && (
                                                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-warning/5 rounded-lg border border-warning/10 w-fit">
                                                    <AlertCircle className="w-3 h-3 text-warning" />
                                                    <p className="text-[9px] font-black text-warning uppercase italic">Note: {item.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-black text-foreground text-lg italic tracking-tighter">{formatCurrency(item.subtotal)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border mt-8 pt-8 relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Dossier Total</p>
                                <p className="text-xs font-bold text-muted-foreground/40 italic">Incl. all tactical service charges</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-black text-foreground tracking-tighter italic">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-muted rounded-xl text-primary group-hover:rotate-12 transition-transform">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Client Context</h3>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Originator Profile</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-border">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black shadow-inner">
                                    {order.customer.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-foreground italic truncate">{order.customer.name}</p>
                                    <p className="text-xs font-bold text-muted-foreground/60 truncate">{order.customer.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-2xl h-12 font-black border-border bg-card shadow-sm text-[10px] tracking-[0.2em] uppercase">
                                <Phone className="w-4 h-4 mr-3" />
                                Initiate Comms
                            </Button>
                        </div>
                    </Card>

                    {/* Locations */}
                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-muted rounded-xl text-primary group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Tactical Points</h3>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Route Matrix</p>
                            </div>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-border border-dashed border-l" />

                            <div className="relative pl-10 group/item">
                                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-card border-2 border-primary shadow-sm flex items-center justify-center z-10 group-hover/item:scale-125 transition-transform">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                </div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 italic">Extraction Point</p>
                                <p className="text-sm font-black text-foreground leading-tight mb-2 uppercase tracking-tighter">{order.pickupAddress.street}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(order.pickupDate, 'MMM d')} • {order.pickupTimeSlot}
                                </div>
                            </div>

                            <div className="relative pl-10 group/item">
                                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-card border-2 border-success shadow-sm flex items-center justify-center z-10 group-hover/item:scale-125 transition-transform">
                                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                                </div>
                                <p className="text-[10px] font-black text-success uppercase tracking-[0.2em] mb-1 italic">Deployment Point</p>
                                <p className="text-sm font-black text-foreground leading-tight mb-2 uppercase tracking-tighter">{order.deliveryAddress.street}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" />
                                    Est. {formatDate(order.expectedDeliveryDate, 'MMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Rider Assignment */}
                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl group">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-muted rounded-xl text-primary group-hover:-translate-y-1 transition-transform">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Logistics Grid</h3>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Asset Management</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-muted/40 rounded-3xl border border-border group/sub">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Pickup Unit</p>
                                {order.pickupRider ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground uppercase italic">{typeof order.pickupRider === 'object' ? (order.pickupRider as any).name : 'Unit assigned'}</p>
                                            <p className="text-[8px] font-bold text-success uppercase mt-0.5 tracking-widest">Verified</p>
                                        </div>
                                    </div>
                                ) : (
                                    <RiderSelector orderId={order._id} type="pickup" branchId={typeof order.branch === 'string' ? order.branch : order.branch?._id} />
                                )}
                            </div>

                            <div className="p-5 bg-muted/40 rounded-3xl border border-border">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Delivery Unit</p>
                                {order.deliveryRider ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                                            <User className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-foreground uppercase italic">{typeof order.deliveryRider === 'object' ? (order.deliveryRider as any).name : 'Unit assigned'}</p>
                                            <p className="text-[8px] font-bold text-success uppercase mt-0.5 tracking-widest">Verified</p>
                                        </div>
                                    </div>
                                ) : (
                                    <RiderSelector orderId={order._id} type="delivery" branchId={typeof order.branch === 'string' ? order.branch : order.branch?._id} />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

const RiderSelector = ({ orderId, type, branchId }: { orderId: string, type: 'pickup' | 'delivery', branchId?: string }) => {
    const [selectedRider, setSelectedRider] = useState('');
    const { data: ridersData, isLoading } = useUsers({
        role: 'rider',
        branchId: branchId,
        limit: 100
    });
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
