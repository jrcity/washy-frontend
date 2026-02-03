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
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Notification Preferences</h3>
                <p className="text-sm text-neutral-500">Choose how you want to receive notifications.</p>
            </div>

            {/* Channel Headers */}
            <div className="grid grid-cols-4 gap-4 items-center text-sm font-medium text-neutral-500 px-4">
                <div className="col-span-1"></div>
                <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Push
                </div>
                <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS
                </div>
            </div>

            {/* Settings List */}
            <div className="space-y-2">
                {settings.map((setting) => (
                    <div
                        key={setting.id}
                        className="grid grid-cols-4 gap-4 items-center p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-neutral-900">{setting.label}</p>
                            <p className="text-xs text-neutral-500">{setting.description}</p>
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

            <div className="flex justify-end pt-4 border-t border-neutral-100">
                <Button onClick={handleSave} isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                    Save Preferences
                </Button>
            </div>
        </div>
    );
};
