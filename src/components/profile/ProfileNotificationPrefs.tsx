import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';
import { Card, Button, Badge, Switch } from '@/components/ui';
import toast from 'react-hot-toast';

interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    email: boolean;
    push: boolean;
    sms: boolean;
}

export const ProfileNotificationPrefs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'order_updates',
            label: 'Order Updates',
            description: 'Notifications about your order status changes',
            email: true,
            push: true,
            sms: false,
        },
        {
            id: 'promotions',
            label: 'Promotions & Offers',
            description: 'Special deals and discounts',
            email: true,
            push: false,
            sms: false,
        },
        {
            id: 'delivery_alerts',
            label: 'Delivery Alerts',
            description: 'Rider arrival and pickup notifications',
            email: true,
            push: true,
            sms: true,
        },
        {
            id: 'payment_receipts',
            label: 'Payment Receipts',
            description: 'Transaction confirmations and receipts',
            email: true,
            push: false,
            sms: false,
        },
    ]);

    const toggleSetting = (id: string, channel: 'email' | 'push' | 'sms') => {
        setSettings(prev =>
            prev.map(s =>
                s.id === id ? { ...s, [channel]: !s[channel] } : s
            )
        );
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Notification preferences saved');
        setIsLoading(false);
    };

    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-xl font-black text-foreground italic uppercase tracking-tighter">Strategic Comms</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Configure your tactical alert channels</p>
            </div>

            {/* Channel Headers */}
            <div className="grid grid-cols-4 gap-4 items-center px-4">
                <div className="col-span-1"></div>
                {(['email', 'push', 'sms'] as const).map((channel) => (
                    <div key={channel} className="flex flex-col items-center gap-2">
                        {channel === 'email' && <Mail className="w-5 h-5 text-primary" />}
                        {channel === 'push' && <Smartphone className="w-5 h-5 text-accent" />}
                        {channel === 'sms' && <MessageSquare className="w-5 h-5 text-success" />}
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{channel}</span>
                    </div>
                ))}
            </div>

            {/* Settings List */}
            <div className="space-y-4">
                {settings.map((setting) => (
                    <div
                        key={setting.id}
                        className="grid grid-cols-4 gap-4 items-center p-6 rounded-[28px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all hover:border-primary/20 group"
                    >
                        <div>
                            <p className="text-xs font-black text-foreground uppercase tracking-tight mb-1">{setting.label}</p>
                            <p className="text-[10px] font-medium text-muted-foreground/60 leading-tight">{setting.description}</p>
                        </div>

                        {(['email', 'push', 'sms'] as const).map((channel) => (
                            <div key={channel} className="flex justify-center">
                                <Switch
                                    checked={setting[channel]}
                                    onChange={() => toggleSetting(setting.id, channel)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-8 border-t border-border">
                <Button
                    onClick={handleSave}
                    isLoading={isLoading}
                    className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-xs uppercase tracking-widest"
                >
                    <Save className="w-4 h-4 mr-3" />
                    Archive Preferences
                </Button>
            </div>
        </div>
    );
};
