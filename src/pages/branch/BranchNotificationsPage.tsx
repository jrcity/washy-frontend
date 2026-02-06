import { useState } from 'react';
import { Bell, Check, CheckCheck, Mail, Clock, Zap, ShieldAlert } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import {
    useNotifications,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead
} from '@/hooks/useNotifications';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
            title="Signal Stream"
            description="Branch-wide tactical alerts and operational logs"
            showBack={true}
            action={
                notifications.some(n => !n.isRead) ? (
                    <Button
                        className="rounded-2xl h-12 px-6 font-black shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]"
                        onClick={handleMarkAllAsRead}
                        isLoading={markAllAsRead.isPending}
                        leftIcon={<CheckCheck className="w-5 h-5" />}
                    >
                        Mark All Read
                    </Button>
                ) : null
            }
        >
            <div className="space-y-10">
                {/* Filter Matrix */}
                <div className="flex items-center gap-3 bg-muted p-1.5 rounded-[28px] border border-border w-fit shadow-inner">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            "px-8 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'all'
                                ? 'bg-card text-foreground shadow-md'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Whole Flux
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={cn(
                            "px-8 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === 'unread'
                                ? 'bg-card text-foreground shadow-md'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Pending Signal
                    </button>
                </div>

                {/* Notifications Feed */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="py-24 rounded-[48px] border-dashed border-2 border-border bg-muted/20 text-center shadow-inner">
                                    <div className="w-20 h-20 bg-card rounded-[32px] shadow-sm flex items-center justify-center mx-auto mb-8 border border-border">
                                        <Bell className="w-10 h-10 text-muted-foreground/20" />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Zero Static</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mt-2">All frequencies are currently clear</p>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="grid gap-4">
                                {notifications.map((notification, i) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card
                                            className={cn(
                                                "p-6 md:p-8 rounded-[40px] border-border bg-card hover:border-primary/40 hover:shadow-2xl transition-all group relative overflow-hidden",
                                                !notification.isRead && "border-2 border-primary/20 bg-primary/5"
                                            )}
                                        >
                                            {/* Glow Artifact */}
                                            {!notification.isRead && (
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                            )}

                                            <div className="flex items-start justify-between gap-6 relative z-10">
                                                <div className="flex items-start gap-6 flex-1">
                                                    <div className={cn(
                                                        "w-14 h-14 md:w-16 md:h-16 rounded-[24px] flex items-center justify-center shadow-inner shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-3",
                                                        !notification.isRead ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/40"
                                                    )}>
                                                        {notification.title.toLowerCase().includes('order') ? <Zap className="w-7 h-7" /> : <Mail className="w-7 h-7" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <h4 className="font-black text-foreground italic uppercase text-sm tracking-tight truncate group-hover:text-primary transition-colors">{notification.title}</h4>
                                                            {!notification.isRead && (
                                                                <Badge className="bg-primary text-primary-foreground border-none font-black text-[8px] uppercase px-2 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">Critical</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-bold text-muted-foreground/80 leading-relaxed max-w-2xl">{notification.message}</p>
                                                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {formatDate(notification.createdAt, 'MMM d, HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-12 h-12 rounded-2xl hover:bg-primary/10 text-primary group-hover:scale-110 transition-transform p-0"
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        isLoading={markAsRead.isPending}
                                                    >
                                                        <Check className="w-6 h-6" />
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
};
