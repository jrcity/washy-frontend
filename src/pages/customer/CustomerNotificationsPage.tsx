import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, RefreshCw, Package, CreditCard, Truck, Info } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Icon mapping for notification types
const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'order_status':
            return Package;
        case 'payment':
            return CreditCard;
        case 'delivery':
            return Truck;
        default:
            return Info;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'order_status':
            return 'bg-primary-100 text-primary-600';
        case 'payment':
            return 'bg-success-50 text-success-600';
        case 'delivery':
            return 'bg-warning-50 text-warning-600';
        default:
            return 'bg-neutral-100 text-neutral-600';
    }
};

export const CustomerNotificationsPage = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { data, isLoading, refetch } = useNotifications({
        isRead: filter === 'unread' ? false : undefined
    });
    const markAsRead = useMarkNotificationAsRead();
    const markAllAsRead = useMarkAllNotificationsAsRead();

    const notifications = data?.notifications || [];

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead.mutateAsync(id);
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead.mutateAsync();
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    if (isLoading) return <LoadingScreen />;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <PageWrapper
            title="Notifications"
            description="Stay updated on your orders and account activity"
            showBack={true}
            action={
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Refresh
                    </Button>
                    {unreadCount > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            isLoading={markAllAsRead.isPending}
                            leftIcon={<CheckCheck className="w-4 h-4" />}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
            }
        >
            {/* Filter Tabs */}
            <div className="flex border-b border-neutral-200 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${filter === 'all'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                        }`}
                >
                    All
                    <Badge size="sm" variant="secondary">{notifications.length}</Badge>
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${filter === 'unread'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                        }`}
                >
                    Unread
                    {unreadCount > 0 && (
                        <Badge size="sm" variant="primary">{unreadCount}</Badge>
                    )}
                </button>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card variant="bordered" className="py-12">
                    <EmptyState
                        icon={<Bell className="w-8 h-8" />}
                        title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        description={filter === 'unread'
                            ? "You're all caught up!"
                            : "When you place orders or receive updates, they'll appear here"
                        }
                    />
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type);
                        const colorClass = getNotificationColor(notification.type);

                        return (
                            <Card
                                key={notification._id}
                                variant="bordered"
                                className={`flex items-start gap-4 p-4 transition-colors ${!notification.isRead ? 'bg-primary-50/30 border-primary-100' : ''
                                    }`}
                            >
                                <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass}`}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className={`font-medium ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-2">
                                                {formatDate(notification.createdAt, 'PPp')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {!notification.isRead && (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        isLoading={markAsRead.isPending}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </PageWrapper>
    );
};

export default CustomerNotificationsPage;
