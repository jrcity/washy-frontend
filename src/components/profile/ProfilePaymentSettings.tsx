import { useState } from 'react';
import { CreditCard, Wallet, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Card, Button, Badge, Switch } from '@/components/ui';
import toast from 'react-hot-toast';

interface PaymentMethod {
    id: string;
    type: 'card' | 'wallet';
    name: string;
    details: string;
    isDefault: boolean;
}

export const ProfilePaymentSettings = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'card',
            name: 'Visa ending in 4242',
            details: 'Expires 12/25',
            isDefault: true,
        },
        {
            id: '2',
            type: 'wallet',
            name: 'Washy Wallet',
            details: '₦5,000.00 balance',
            isDefault: false,
        },
    ]);

    const handleSetDefault = (id: string) => {
        setMethods(prev =>
            prev.map(m => ({ ...m, isDefault: m.id === id }))
        );
        toast.success('Default payment method updated');
    };

    const handleRemove = (id: string) => {
        setMethods(prev => prev.filter(m => m.id !== id));
        toast.success('Payment method removed');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">Manage your saved payment options.</p>
                </div>
                <Button size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
                    Add New
                </Button>
            </div>

            {/* Payment Methods List */}
            <div className="space-y-3">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${method.isDefault
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border bg-card hover:bg-muted'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.type === 'card' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                                }`}>
                                {method.type === 'card' ? (
                                    <CreditCard className="w-6 h-6" />
                                ) : (
                                    <Wallet className="w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{method.name}</p>
                                    {method.isDefault && (
                                        <Badge size="sm" variant="primary">Default</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{method.details}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!method.isDefault && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleSetDefault(method.id)}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Set Default
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                onClick={() => handleRemove(method.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Wallet Balance Card */}
            <div className="p-6 rounded-xl bg-primary shadow-lg shadow-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-primary-foreground/80">Washy Wallet Balance</p>
                        <p className="text-3xl font-bold text-primary-foreground mt-1">₦5,000.00</p>
                    </div>
                    <Button variant="secondary" size="sm">
                        Top Up
                    </Button>
                </div>
            </div>

            {/* Auto-pay Settings */}
            <div className="p-4 rounded-xl bg-muted">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-foreground">Auto-pay for Orders</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Automatically charge your default payment method for new orders.
                        </p>
                    </div>
                    <Switch checked={true} onChange={() => { }} />
                </div>
            </div>
        </div>
    );
};
