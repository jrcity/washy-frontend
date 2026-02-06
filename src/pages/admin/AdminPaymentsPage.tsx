import { useState } from 'react';
import { Search, Filter, CreditCard, CheckCircle, XCircle, Clock, RefreshCw, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, EmptyState, Select } from '@/components/ui';
import { PaymentDetailsModal } from '@/components/admin';
import { usePayments } from '@/hooks';
import { formatDate, formatCurrency, cn } from '@/lib/utils';

const getPaymentStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return <Badge variant="success">Completed</Badge>;
        case 'pending':
            return <Badge variant="warning">Pending</Badge>;
        case 'failed':
            return <Badge variant="error">Failed</Badge>;
        case 'refunded':
            return <Badge variant="secondary">Refunded</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const getPaymentMethodIcon = (method: string) => {
    switch (method) {
        case 'card':
            return '💳';
        case 'bank_transfer':
            return '🏦';
        case 'cash':
            return '💵';
        default:
            return '💰';
    }
};

export const AdminPaymentsPage = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<import('@/types').Payment | null>(null);

    const { data, isLoading, refetch } = usePayments({
        status: statusFilter === 'all' ? undefined : (statusFilter as import('@/types').PaymentStatus),
        limit: 50
    });

    const payments = Array.isArray(data) ? data : (data as any)?.data || [];

    const filteredPayments = payments.filter((payment: import('@/types').Payment) => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            (payment.paystackReference?.toLowerCase().includes(term) || '') ||
            payment.order?.toString().includes(term)
        );
    });

    // Calculate stats
    const stats = {
        total: payments.length,
        completed: payments.filter((p: import('@/types').Payment) => p.status === 'completed').length,
        pending: payments.filter((p: import('@/types').Payment) => p.status === 'pending').length,
        totalAmount: payments
            .filter((p: import('@/types').Payment) => p.status === 'completed')
            .reduce((acc: number, p: import('@/types').Payment) => acc + (p.amount || 0), 0),
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper
            title="Payments"
            description="View and manage all payment transactions"
            action={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                    Refresh
                </Button>
            }
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Transactions', value: stats.total, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/5', trend: 'ACTIVE' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-success', bg: 'bg-success/5', trend: 'VERIFIED' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-warning', bg: 'bg-warning/5', trend: 'WAITING' },
                    { label: 'Total Revenue', value: formatCurrency(stats.totalAmount), icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/5', trend: 'TOTAL' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                            <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-colors", stat.bg)} />
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", stat.bg)}>
                                    <stat.icon className={cn("w-7 h-7", stat.color)} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <h4 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{stat.value}</h4>
                                        <Badge className="bg-muted text-muted-foreground/60 border-none font-black text-[8px] tracking-tighter uppercase rounded-full px-2 py-0.5">{stat.trend}</Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search by reference or order ID..."
                        leftIcon={<Search className="w-4 h-4" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md rounded-2xl border-border bg-card shadow-sm"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Select
                        label=""
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'failed', label: 'Failed' },
                            { value: 'refunded', label: 'Refunded' },
                        ]}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-40"
                    />
                </div>
            </div>

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
                <Card variant="bordered" className="py-12">
                    <EmptyState
                        icon={<CreditCard className="w-8 h-8" />}
                        title="No payments found"
                        description="Try adjusting your filters or search term"
                    />
                </Card>
            ) : (
                <Card className="rounded-[40px] border-border bg-card shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -mr-24 -mt-24" />
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reference</th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Method</th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                    <th className="text-left px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPayments.map((payment: import('@/types').Payment, i: number) => (
                                    <motion.tr
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        key={payment._id}
                                        className="hover:bg-primary/[0.02] transition-colors cursor-pointer group"
                                        onClick={() => setSelectedPayment(payment)}
                                    >
                                        <td className="px-8 py-6">
                                            <span className="font-black text-foreground italic uppercase text-xs tracking-tight group-hover:text-primary transition-colors">{payment.paystackReference || 'N/A'}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getPaymentMethodIcon(payment.method)}</span>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{payment.method?.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-base font-black text-foreground tracking-tighter italic">{formatCurrency(payment.amount)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {getPaymentStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            {formatDate(payment.createdAt, 'PP')}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <PaymentDetailsModal
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                payment={selectedPayment}
            />
        </PageWrapper>
    );
};

export default AdminPaymentsPage;
