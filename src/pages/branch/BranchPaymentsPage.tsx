import { useState } from 'react';
import {
    CreditCard, DollarSign, TrendingUp, Calendar,
    Download, Filter, CheckCircle, Clock, XCircle,
    ArrowUpRight, ArrowDownRight, Wallet, Search,
    ChevronRight, MoreVertical, FileText, BadgeCheck
} from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, Input, LoadingScreen, EmptyState, Select } from '@/components/ui';
import { PaymentDetailsModal } from '@/components/admin';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'success';
        case 'pending': return 'warning';
        case 'failed': return 'error';
        case 'refunded': return 'secondary';
        default: return 'secondary';
    }
};

export const BranchPaymentsPage = () => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<import('@/types').Payment | null>(null);

    const { data, isLoading } = usePayments({
        status: statusFilter === 'all' ? undefined : (statusFilter as import('@/types').PaymentStatus)
    });

    const payments = data || [];
    const filteredPayments = payments.filter((p: any) =>
        p.paystackReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Summary stats
    const totalReceived = payments
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + p.amountPaid, 0);

    const pendingAmount = payments
        .filter((p: any) => p.status === 'pending')
        .reduce((sum: number, p: any) => sum + p.amount, 0);

    const transactionVolume = payments.length;

    if (isLoading) return <LoadingScreen message="Synchronizing Ledger..." />;

    const stats = [
        { label: 'Settled Funds', value: formatCurrency(totalReceived), icon: Wallet, color: 'success', shadow: 'shadow-success/10' },
        { label: 'Pending Liquidity', value: formatCurrency(pendingAmount), icon: Clock, color: 'warning', shadow: 'shadow-warning/10' },
        { label: 'Transaction Count', value: transactionVolume, icon: BadgeCheck, color: 'primary', shadow: 'shadow-primary/10' },
    ];

    return (
        <PageWrapper
            title="Financial Ledger"
            description="Operational cash flow and transaction matrix"
            showBack={true}
            action={
                <Button variant="outline" className="w-full sm:w-auto rounded-2xl h-12 px-6 font-black border-border bg-card shadow-sm hover:bg-muted/50 transition-colors" leftIcon={<Download className="w-4 h-4" />}>
                    Export Statement
                </Button>
            }
        >
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className={cn("p-5 md:p-6 rounded-[28px] md:rounded-[32px] border-border shadow-sm relative overflow-hidden group bg-card", stat.shadow)}>
                                <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full -mr-8 -mt-8 md:-mr-10 md:-mt-10 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center gap-5">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                                        stat.color === 'success' ? "bg-success/10 text-success" :
                                            stat.color === 'warning' ? "bg-warning/10 text-warning" :
                                                "bg-primary/10 text-primary"
                                    )}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-foreground tracking-tight">{stat.value}</h3>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-card p-4 rounded-[28px] border border-border shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                            <input
                                type="text"
                                placeholder="Search Reference..."
                                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-muted border-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-foreground outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            label=""
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'completed', label: 'Settled' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'failed', label: 'Failed' },
                                { value: 'refunded', label: 'Refunded' },
                            ]}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-40 h-12 !mt-0 !bg-muted !border-none !rounded-2xl font-black text-xs uppercase text-foreground"
                        />
                    </div>
                </div>

                {/* Table View */}
                <Card className="rounded-[40px] border-border shadow-xl overflow-hidden bg-card">
                    {filteredPayments.length === 0 ? (
                        <div className="py-24">
                            <EmptyState
                                icon={<div className="w-20 h-20 bg-muted rounded-[30px] flex items-center justify-center mx-auto mb-6"><CreditCard className="w-10 h-10 text-muted-foreground/30" /></div>}
                                title="No Transactions"
                                description="Your branch's financial footprint will appear here once orders are processed."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction</th>
                                        <th className="hidden sm:table-cell px-6 md:px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Customer / Order</th>
                                        <th className="hidden lg:table-cell px-6 md:px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Timestamp</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredPayments.map((payment: any, i: number) => (
                                        <motion.tr
                                            key={payment._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                            onClick={() => setSelectedPayment(payment)}
                                        >
                                            <td className="px-6 md:px-8 py-6">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                                                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/60" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-mono text-xs font-black text-foreground truncate">{payment.paystackReference || payment._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">{payment.method}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-6 md:px-8 py-6">
                                                <div>
                                                    <p className="font-bold text-foreground/80 text-sm">{payment.order?.orderNumber || 'Quick Order'}</p>
                                                    <p className="text-[10px] font-black text-primary uppercase italic">ID: {payment.customer?.slice(-6) || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 md:px-8 py-6">
                                                <p className="text-xs font-bold text-muted-foreground">{formatDate(payment.createdAt, 'MMM d, yyyy')}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground/40">{formatDate(payment.createdAt, 'HH:mm')}</p>
                                            </td>
                                            <td className="px-6 md:px-8 py-6">
                                                <Badge size="sm" variant={getStatusColor(payment.status)} className="rounded-lg px-2 py-1 font-black italic uppercase text-[9px] tracking-wider">
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 md:px-8 py-6 text-right">
                                                <p className="text-sm font-black text-foreground">{formatCurrency(payment.amount)}</p>
                                                {payment.status === 'completed' && payment.amountPaid < payment.amount && (
                                                    <p className="text-[10px] font-bold text-warning italic">Partial Rec.</p>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <PaymentDetailsModal
                    isOpen={!!selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                    payment={selectedPayment}
                />
            </div>
        </PageWrapper>
    );
};

export default BranchPaymentsPage;
