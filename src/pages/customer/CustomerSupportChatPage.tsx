import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { chatService } from '@/services/chat.service';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageCircle, Headphones, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Button, Input, Select, Card } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { motion } from 'framer-motion';

interface StartChatForm {
    reason: string;
    orderId?: string;
}

export const CustomerSupportChatPage: React.FC = () => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<StartChatForm>();

    const onSubmit = async (data: StartChatForm) => {
        try {
            const response = await chatService.startSupportChat(data);
            if (response.success && response.data) {
                setActiveConversationId(response.data._id);
            }
        } catch (error) {
            console.error('Failed to start chat', error);
        }
    };

    if (activeConversationId) {
        return (
            <PageWrapper
                title="Active Support"
                description="Live chat with our support team"
                action={
                    <Button variant="outline" size="sm" onClick={() => setActiveConversationId(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        New Request
                    </Button>
                }
            >
                <div className="max-w-4xl mx-auto h-[600px]">
                    <ChatWindow
                        conversationId={activeConversationId}
                        onClose={() => setActiveConversationId(null)}
                    />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper title="Support Center" description="We're here to help you with anything you need.">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="grid md:grid-cols-5 gap-8 items-start">
                    {/* Left Side: Info */}
                    <div className="md:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-primary-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Headphones className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">How can we help?</h2>
                            <p className="text-primary-100 font-medium leading-relaxed mb-8">
                                Start a conversation with our support team. We typically reply within a few minutes.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Email Support</p>
                                        <p className="font-bold text-white">support@washy.ng</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Phone Support</p>
                                        <p className="font-bold text-white">+234 800 WAS HYNG</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-8 border-neutral-100 shadow-xl rounded-[40px]">
                                <h3 className="text-xl font-bold text-neutral-900 mb-6">Start Support Session</h3>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <Controller
                                        name="reason"
                                        control={control}
                                        rules={{ required: 'Please select a topic' }}
                                        render={({ field }) => (
                                            <Select
                                                label="Topic or Issue"
                                                options={[
                                                    { value: "Order Status", label: "Order Status Inquiry" },
                                                    { value: "Payment Issue", label: "Payment Issue" },
                                                    { value: "Delivery Problem", label: "Delivery Problem" },
                                                    { value: "Missing Item", label: "Missing Item" },
                                                    { value: "Other", label: "Other Inquiry" },
                                                ]}
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                error={errors.reason?.message}
                                            />
                                        )}
                                    />

                                    <Input
                                        label="Order ID (Optional)"
                                        {...register('orderId')}
                                        placeholder="e.g. WS-2024-XXXX"
                                        className="bg-neutral-50 border-neutral-100 focus-within:bg-white"
                                    />

                                    <Button
                                        type="submit"
                                        isLoading={isSubmitting}
                                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200"
                                        leftIcon={<MessageCircle className="w-5 h-5" />}
                                    >
                                        {isSubmitting ? 'Initializing...' : 'Start Secure Chat'}
                                    </Button>

                                    <p className="text-center text-xs text-neutral-400 font-medium">
                                        Support available Mon - Sat, 8:00 AM - 8:00 PM
                                    </p>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default CustomerSupportChatPage;
