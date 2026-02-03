import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Package, User, Clock, Receipt, CheckCircle } from 'lucide-react';
import { usePayment } from '@/hooks/usePayments';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        completed: 'bg-success-100 text-success-700',
        pending: 'bg-warning-100 text-warning-700',
        failed: 'bg-error-100 text-error-700',
        refunded: 'bg-neutral-100 text-neutral-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
};

export const AdminPaymentDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: payment, isLoading } = usePayment(id!);

    if (isLoading) return <LoadingScreen />;
    if (!payment) return <div className="text-center py-12">Payment not found</div>;

    // Use paystackReference as the display reference
    const displayReference = payment.paystackReference || payment._id.slice(-8).toUpperCase();

    return (
        <PageWrapper
            title={`Payment ${displayReference}`}
            description="View payment transaction details"
            action={
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/payments')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Payments
                </Button>
            }
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Status Card */}
                    <Card className="p-6 border-primary-100 bg-gradient-to-br from-primary-50/50 to-white">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">Payment Status</p>
                                <Badge className={`${getPaymentStatusColor(payment.status)} text-base py-1 px-3`}>
                                    {payment.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-neutral-500 mb-1">Amount</p>
                                <p className="text-3xl font-bold text-neutral-900">{formatCurrency(payment.amount)}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                            <div>
                                <p className="text-sm text-neutral-500">Reference</p>
                                <p className="font-mono text-sm text-neutral-900">{displayReference}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500">Payment Method</p>
                                <p className="font-medium text-neutral-900 capitalize">{payment.method}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Transaction Timeline */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-neutral-500" />
                            Transaction Timeline
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-success-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">Payment Initiated</p>
                                    <p className="text-sm text-neutral-500">{formatDate(payment.createdAt, 'PPpp')}</p>
                                </div>
                            </div>

                            {payment.status === 'completed' && payment.paidAt && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-success-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Payment Completed</p>
                                        <p className="text-sm text-neutral-500">{formatDate(payment.paidAt, 'PPpp')}</p>
                                    </div>
                                </div>
                            )}

                            {payment.status === 'failed' && payment.failedAt && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-error-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Payment Failed</p>
                                        <p className="text-sm text-neutral-500">{formatDate(payment.failedAt, 'PPpp')}</p>
                                        {payment.failureReason && (
                                            <p className="text-sm text-error-600 mt-1">{payment.failureReason}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Metadata/Additional Info */}
                    {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-neutral-500" />
                                Additional Details
                            </h3>
                            <pre className="bg-neutral-50 p-4 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(payment.metadata, null, 2)}
                            </pre>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Associated Order */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4 text-neutral-500" />
                            Associated Order
                        </h3>
                        {payment.order ? (
                            <div>
                                <Link
                                    to={`/admin/orders/${payment.order}`}
                                    className="font-medium text-primary-600 hover:underline"
                                >
                                    View Order
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">No order associated</p>
                        )}
                    </Card>

                    {/* Customer */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-neutral-500" />
                            Customer
                        </h3>
                        {payment.customer ? (
                            <div className="text-sm text-neutral-600">
                                <p>Customer ID: {payment.customer}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">No customer info</p>
                        )}
                    </Card>

                    {/* Actions */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-neutral-500" />
                            Actions
                        </h3>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full" size="sm">
                                Download Receipt
                            </Button>
                            {payment.status === 'completed' && (
                                <Button variant="outline" className="w-full text-warning-600 border-warning-200 hover:bg-warning-50" size="sm">
                                    Process Refund
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};
