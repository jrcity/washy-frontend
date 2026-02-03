import { Modal, Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Payment } from '@/types';
import { CreditCard, Calendar, CheckCircle, User, FileText } from 'lucide-react';

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}

export const PaymentDetailsModal = ({ isOpen, onClose, payment }: PaymentDetailsModalProps) => {
    if (!payment) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Payment Details"
            icon={<CreditCard className="w-5 h-5 text-neutral-500" />}
            size="md"
            footer={
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Header Amount */}
                <div className="text-center p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                    <h2 className="text-3xl font-bold text-neutral-900">{formatCurrency(payment.amount)}</h2>
                    <div className="mt-2 flex justify-center">
                        <Badge variant={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}>
                            {payment.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-neutral-500 text-sm">
                            <FileText className="w-4 h-4" />
                            <span>Reference</span>
                        </div>
                        <p className="font-mono text-sm font-medium">{payment.paystackReference || 'N/A'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-neutral-500 text-sm">
                            <CreditCard className="w-4 h-4" />
                            <span>Method</span>
                        </div>
                        <p className="font-medium capitalize">{payment.method.replace('_', ' ')}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-neutral-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Date</span>
                        </div>
                        <p className="font-medium">{formatDate(payment.createdAt)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-neutral-500 text-sm">
                            <User className="w-4 h-4" />
                            <span>User ID</span>
                        </div>
                        <p className="font-mono text-xs truncate" title={payment.user}>{payment.user}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
