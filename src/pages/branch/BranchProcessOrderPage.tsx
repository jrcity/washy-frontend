import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, MapPin, Phone, User, Clock,
  CheckCircle, Truck, AlertTriangle, ArrowLeft, ChevronRight, Zap, PlayCircle
} from 'lucide-react';
import { useOrder, useUpdateOrderStatus } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen, Select } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate, cn } from '@/lib/utils';
import { AssignRiderModal } from './BranchAssignRiderModal';
import type { OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export const BranchProcessOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-12">Manifest not found in local sector</div>;

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateStatus(
      { id: order._id, data: { status: newStatus } },
      {
        onSuccess: () => {
          setSelectedStatus('');
        }
      }
    );
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'PENDING' },
    { value: 'confirmed', label: 'CONFIRMED' },
    { value: 'picked_up', label: 'PICKED UP' },
    { value: 'in_process', label: 'IN PROCESS' },
    { value: 'ready', label: 'READY' },
    { value: 'out_for_delivery', label: 'OUT FOR DELIVERY' },
    { value: 'delivered', label: 'DELIVERED' },
    { value: 'completed', label: 'COMPLETED' },
    { value: 'cancelled', label: 'CANCELLED' },
  ];

  return (
    <PageWrapper
      title={`Dossier #${order.orderNumber} `}
      description="Tactical management of operational lifecycle"
      showBack={true}
    >
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Status Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 rounded-[40px] border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Operational Status</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Lifecycle Management Protocol</p>
                  </div>
                </div>
                <Badge className={cn("rounded-full px-4 py-1.5 font-black italic uppercase text-[10px] tracking-widest border-none shadow-sm", getStatusColor(order.status))}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex flex-col md:flex-row items-end gap-6 relative z-10">
                <div className="flex-1 w-full space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Transition To</p>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => {
                      if (e.target.value) handleStatusUpdate(e.target.value as OrderStatus);
                    }}
                    disabled={isUpdating}
                    options={[
                      { value: "", label: "SELECT ACTION..." },
                      ...statusOptions.map(opt => ({
                        ...opt,
                        disabled: opt.value === order.status
                      }))
                    ]}
                    className="h-14 rounded-2xl bg-card border-border font-black text-xs uppercase tracking-widest shadow-sm"
                  />
                </div>
                <Button
                  disabled={!selectedStatus || isUpdating}
                  isLoading={isUpdating}
                  className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                >
                  Confirm Change
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Items Registry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-muted/50 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-muted rounded-2xl text-primary shadow-sm">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Unit Registry</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Verified Item Inventory</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-5 rounded-[28px] bg-muted/30 border border-border group hover:bg-muted transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center font-black text-primary shadow-inner group-hover:scale-110 transition-transform">
                        {item.quantity}
                      </div>
                      <div>
                        <p className="font-black text-foreground italic uppercase text-xs tracking-tight">
                          {typeof item.service === 'string' ? 'Service' : item.service.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{item.garmentType}</p>
                        {item.notes && (
                          <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-warning/5 rounded-lg border border-warning/10 w-fit">
                            <AlertTriangle className="w-3 h-3 text-warning" />
                            <span className="text-[9px] font-black text-warning uppercase italic tracking-widest">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="font-black text-foreground italic text-sm tracking-tighter">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-10 pt-8 relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Dossier Total</p>
                  <p className="text-xs font-bold text-muted-foreground/40 italic">Incl. all tactical service charges</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-foreground tracking-tighter italic">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Customer Dossier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl overflow-hidden group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-muted border border-border flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                  <span className="text-xl font-black text-primary italic uppercase">{order.customer.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-black text-foreground italic uppercase text-sm tracking-tight group-hover:text-primary transition-colors">{order.customer.name}</h3>
                  <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1">Verified Client</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                  <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1 italic">Contact Channel</p>
                  <p className="text-xs font-bold text-foreground truncate">{order.customer.email}</p>
                </div>
                <Button variant="outline" className="w-full rounded-2xl h-14 font-black border-border bg-card shadow-sm tracking-widest uppercase text-[10px] group-hover:border-primary/50 transition-all">
                  <Phone className="w-4 h-4 mr-3 text-primary" />
                  Initiate Comms
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Navigational Logic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative group">
              <div className="space-y-10 relative">
                <div className="absolute left-6 top-10 bottom-10 w-px bg-border group-hover:bg-primary/20 transition-colors" />
                <div className="relative pl-14">
                  <div className="absolute left-0 top-1.5 w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">Extraction Point</p>
                  <p className="text-xs font-black text-foreground italic uppercase tracking-tight">{order.pickupAddress.street}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(order.pickupDate, 'MMM d')} • {order.pickupTimeSlot}
                  </div>
                </div>
                <div className="relative pl-14">
                  <div className="absolute left-0 top-1.5 w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">Deployment Point</p>
                  <p className="text-xs font-black text-foreground italic uppercase tracking-tight">{order.deliveryAddress.street}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    Est. {formatDate(order.expectedDeliveryDate, 'MMM d')}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Asset Deployment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-muted rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-tight italic">Logistic Units</h3>
                  <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mt-0.5">Asset Assignment Status</p>
                </div>
              </div>

              {order.pickupRider || order.deliveryRider ? (
                <div className="p-5 rounded-[28px] bg-primary/5 border border-primary/20 flex items-center gap-4 mb-6 relative overflow-hidden group/rider">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12" />
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black italic shadow-lg shadow-primary/20 relative z-10 transition-transform group-hover/rider:rotate-6">
                    R
                  </div>
                  <div className="relative z-10">
                    <p className="font-black text-foreground italic uppercase text-xs tracking-tight">Active Operative</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">ID: {(() => {
                      const rider = order.pickupRider || order.deliveryRider;
                      if (!rider) return 'N/A';
                      const id = typeof rider === 'object' ? (rider as any)._id : rider;
                      return id.toString().slice(-6).toUpperCase();
                    })()}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-[32px] border-2 border-dashed border-border flex flex-col items-center justify-center mb-6 bg-muted/20">
                  <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Awaiting Deployment</div>
                </div>
              )}

              <Button
                className="w-full rounded-2xl h-14 font-black shadow-xl shadow-primary/20 text-sm tracking-widest uppercase transition-all"
                onClick={() => setIsRiderModalOpen(true)}
              >
                {order.pickupRider || order.deliveryRider ? 'Reassign Unit' : 'Deploy Unit'}
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      <AssignRiderModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        orderId={order._id}
        type={['pending', 'confirmed'].includes(order.status) ? 'pickup' : 'delivery'}
      />
    </PageWrapper>
  );
};
