import { Modal, Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { Payment } from '@/types';
import { CreditCard, Calendar, CheckCircle, User, FileText, BadgeCheck, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'completed': return 'success';
        case 'pending': return 'warning';
        case 'failed': return 'error';
        default: return 'secondary';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed': return BadgeCheck;
        case 'pending': return Clock;
        default: return AlertCircle;
    }
};

export const PaymentDetailsModal = ({ isOpen, onClose, payment }: PaymentDetailsModalProps) => {
    if (!payment) return null;

    const StatusIcon = getStatusIcon(payment.status);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transaction Receipt"
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            size="md"
            footer={
                <div className="w-full flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black border-border shadow-sm" onClick={onClose}>
                        DISMISS
                    </Button>
                    <Button className="flex-[2] rounded-2xl h-12 font-black shadow-lg shadow-primary/20">
                        DOWNLOAD RECEIPT
                    </Button>
                </div>
            }
        >
            <div className="space-y-8 py-2">
                {/* Header Amount */}
                <div className="relative overflow-hidden p-8 bg-card rounded-[32px] border border-border text-center shadow-inner">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Verified Transaction Total</p>
                    <h2 className="text-4xl font-black text-foreground tracking-tighter mb-4">{formatCurrency(payment.amount)}</h2>
                    <div className="flex justify-center">
                        <Badge
                            variant={getStatusVariant(payment.status)}
                            className="rounded-full px-4 py-1.5 font-black italic uppercase text-[10px] tracking-widest border-none flex items-center gap-2"
                        >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {payment.status}
                        </Badge>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-muted/30 rounded-[24px] border border-border group hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <FileText className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Digital Signature</span>
                        </div>
                        <p className="font-mono text-xs font-black text-foreground break-all">{payment.paystackReference || payment._id.toUpperCase()}</p>
                    </div>

                    <div className="p-5 bg-muted/30 rounded-[24px] border border-border group hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Gateway Matrix</span>
                        </div>
                        <p className="text-sm font-black text-foreground capitalize italic">{payment.method.replace('_', ' ')}</p>
                    </div>

                    <div className="p-5 bg-muted/30 rounded-[24px] border border-border group hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Deployment Date</span>
                        </div>
                        <p className="text-sm font-black text-foreground">{formatDate(payment.createdAt, 'PPP')}</p>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1">{formatDate(payment.createdAt, 'HH:mm:ss')}</p>
                    </div>

                    <div className="p-5 bg-muted/30 rounded-[24px] border border-border group hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <User className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Originator ID</span>
                        </div>
                        <p className="font-mono text-[10px] font-black text-foreground truncate uppercase">{payment.customer || payment.user || 'ANONYMOUS'}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
