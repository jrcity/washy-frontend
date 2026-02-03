import { useState } from 'react';
import { Search, Filter, CreditCard, CheckCircle, XCircle, Clock, RefreshCw, Eye } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, EmptyState, Select } from '@/components/ui';
import { PaymentDetailsModal } from '@/components/admin';
import { usePayments } from '@/hooks';
import { formatDate, formatCurrency } from '@/lib/utils';

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card variant="bordered">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Transactions</p>
                            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-success-50 text-success-600 rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Completed</p>
                            <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-warning-50 text-warning-600 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Pending</p>
                            <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="bordered">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalAmount)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search by reference or order ID..."
                        leftIcon={<Search className="w-4 h-4" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:max-w-sm"
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
                <Card variant="bordered" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-600">Reference</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-600">Method</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-600">Amount</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-600">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-600">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredPayments.map((payment: import('@/types').Payment) => (
                                    <tr
                                        key={payment._id}
                                        className="hover:bg-neutral-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedPayment(payment)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-neutral-900">{payment.paystackReference || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>{getPaymentMethodIcon(payment.method)}</span>
                                                <span className="text-sm text-neutral-600 capitalize">{payment.method?.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-neutral-900">{formatCurrency(payment.amount)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {formatDate(payment.createdAt, 'PP')}
                                        </td>
                                    </tr>
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
