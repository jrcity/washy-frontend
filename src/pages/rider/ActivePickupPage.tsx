import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks';
import { chatService } from '@/services/chat.service';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, Spinner } from '@/components/ui';
import { Phone, MapPin, Navigation, CheckCircle, Package, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const ActivePickupPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading } = useOrder(id!);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    if (!order) return <div>Order not found</div>;

    const targetAddress = order.pickupAddress;
    const targetName = order.customer.name;
    const targetPhone = order.customer.phone;

    const [isStartingChat, setIsStartingChat] = useState(false);

    const handleMessageCustomer = async () => {
        setIsStartingChat(true);
        try {
            const response = await chatService.startRiderChat({ orderId: id! });
            if (response.success && response.data) {
                navigate('/chat'); // Navigate to global chat or specific conv
            }
        } catch (error) {
            console.error('Failed to start chat', error);
        } finally {
            setIsStartingChat(false);
        }
    };

    const handleComplete = () => {
        // Navigate to a verification page or trigger a modal
        navigate(`/rider/verify/${id}`);
    };

    const isPickup = true; // This page is specifically for pickup

    return (
        <PageWrapper title="Active Task" showBack>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Map Placeholder */}
                <div className="lg:col-span-2 min-h-[400px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mb-2" />
                    <p>Map Integration Placeholder</p>
                </div>

                {/* Task Details */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="mb-6">
                            <Badge variant={isPickup ? 'info' : 'warning'} className="mb-2">
                                {isPickup ? 'Pickup Task' : 'Delivery Task'}
                            </Badge>
                            <h2 className="text-xl font-bold text-foreground">{order.orderNumber}</h2>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Package className="w-4 h-4" />
                                <span>{order.items.length} Items to Collect</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Location</p>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{targetAddress.area}</p>
                                        <p className="text-foreground/80 text-sm">{targetAddress.street}</p>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Scheduled: {formatDate(order.pickupDate, 'PP')} ({order.pickupTimeSlot})
                                        </div>
                                        <a
                                            href={`https://maps.google.com/?q=${targetAddress.street}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary text-sm font-medium hover:underline mt-2 inline-block"
                                        >
                                            Open in Maps
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Customer</p>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold text-muted-foreground">{targetName[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">{targetName}</p>
                                        <div className="flex gap-4 mt-1">
                                            <a href={`tel:${targetPhone}`} className="flex items-center gap-1 text-foreground/80 text-sm hover:text-primary">
                                                <Phone className="w-3 h-3" />
                                                Call
                                            </a>
                                            <button
                                                onClick={handleMessageCustomer}
                                                disabled={isStartingChat}
                                                className="flex items-center gap-1 text-primary text-sm hover:underline"
                                            >
                                                <MessageCircle className="w-3 h-3" />
                                                {isStartingChat ? 'Connecting...' : 'Message'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted rounded-lg border border-border">
                                <h4 className="font-medium text-sm mb-2">Instructions</h4>
                                <p className="text-sm text-foreground/80">
                                    Verify the number of items matches the order. Check for any visible damage before accepting.
                                </p>
                            </div>

                            <Button size="lg" className="w-full" onClick={handleComplete}>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Verify Pickup
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ActivePickupPage;
