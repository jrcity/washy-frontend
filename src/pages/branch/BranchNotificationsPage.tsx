import { useState } from 'react';
import { Bell, Check, CheckCheck, Mail, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import {
    useNotifications,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead
} from '@/hooks/useNotifications';
import { formatDate } from '@/lib/utils';

export const BranchNotificationsPage = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { data, isLoading, refetch } = useNotifications({
        isRead: filter === 'unread' ? false : undefined
    });
    const markAsRead = useMarkNotificationAsRead();
    const markAllAsRead = useMarkAllNotificationsAsRead();

    const notifications = data?.notifications || [];

    const handleMarkAsRead = (id: string) => {
        markAsRead.mutate(id, { onSuccess: () => refetch() });
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate(undefined, { onSuccess: () => refetch() });
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper
            title="Notifications"
            description="Branch alerts and order updates"
            action={
                notifications.some(n => !n.isRead) ? (
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<CheckCheck className="w-4 h-4" />}
                        onClick={handleMarkAllAsRead}
                        isLoading={markAllAsRead.isPending}
                    >
                        Mark All Read
                    </Button>
                ) : null
            }
        >
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                >
                    Unread
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <Card variant="bordered" className="py-12">
                        <EmptyState
                            icon={<Bell className="w-12 h-12 text-neutral-300" />}
                            title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                            description="Order updates and branch alerts will appear here"
                        />
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <Card
                            key={notification._id}
                            variant="bordered"
                            className={`p-4 transition-all ${!notification.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-neutral-900">{notification.title}</h4>
                                            {!notification.isRead && (
                                                <Badge size="sm" variant="primary">New</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-600">{notification.message}</p>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(notification.createdAt, 'PPp')}
                                        </div>
                                    </div>
                                </div>
                                {!notification.isRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        isLoading={markAsRead.isPending}
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </PageWrapper>
    );
};
