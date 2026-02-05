import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuthContext } from '@/context/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import { Input, Badge, Spinner, Button } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { format } from 'date-fns';
import { Users, Search, MessageSquare, Filter, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatService } from '@/services/chat.service';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminChatPage: React.FC = () => {
    const {
        activeConversationId,
        setActiveConversationId,
        isLoadingConversations,
        conversations,
        isConnected
    } = useChat();
    const { user } = useAuthContext();

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const [search, setSearch] = useState('');

    const filteredConversations = conversations.filter(conv =>
        conv.participants?.some(p => p.name.toLowerCase().includes(search.toLowerCase())) ||
        conv.lastMessage?.content?.toLowerCase().includes(search.toLowerCase())
    );

    const activeConversation = conversations.find(c => c._id === activeConversationId);

    const handleStatusUpdate = async (conversationId: string, action: 'close' | 'reopen') => {
        setIsUpdatingStatus(true);
        try {
            await chatService.updateConversationStatus(conversationId, action);
            toast.success(`Conversation ${action === 'close' ? 'closed' : 'reopened'} successfully`);
            // The ChatContext handles the socket event or we might need to refresh
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <PageWrapper
            title="Support Matrix"
            description="Real-time multi-channel assistance"
            showBack={true}
        >
            <div className="h-[calc(100vh-18rem)] flex gap-6">
                {/* Sidebar List */}
                <div className="w-96 flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-2xl text-neutral-900 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                Inbox
                            </h2>
                            <Badge variant={isConnected ? "success" : "warning"} size="sm">
                                {isConnected ? "Connected" : "Reconnecting"}
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <Input
                                    placeholder="Search chats..."
                                    className="pl-10 h-11 bg-neutral-50 border-neutral-100 rounded-2xl focus-within:bg-white transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="w-11 h-11 rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-center text-neutral-500 hover:bg-white transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                        {isLoadingConversations ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Spinner size="lg" className="text-primary-500" />
                                <p className="text-sm font-medium text-neutral-400">Loading inbox...</p>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                                    <Users className="w-8 h-8 text-neutral-400" />
                                </div>
                                <p className="font-bold text-neutral-900 mb-1">No chats found</p>
                                <p className="text-sm text-neutral-500">Wait for users to start a support session.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const isActive = activeConversationId === conv._id;
                                const participant = conv.participants?.find(p => p._id !== user?._id) || conv.participants?.[0];
                                const hasUnread = (conv.unreadCount || 0) > 0;

                                return (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={conv._id}
                                        onClick={() => setActiveConversationId(conv._id)}
                                        className={cn(
                                            "w-full p-4 rounded-2xl text-left transition-all duration-300 flex gap-4 items-start group relative",
                                            isActive
                                                ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                                                : "hover:bg-neutral-50 text-neutral-600"
                                        )}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm",
                                                isActive ? "bg-white/20 text-white" : "bg-primary-50 text-primary-600"
                                            )}>
                                                {participant?.name?.charAt(0) || '?'}
                                            </div>
                                            {hasUnread && !isActive && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={cn(
                                                    "font-bold truncate",
                                                    isActive ? "text-white" : "text-neutral-900"
                                                )}>
                                                    {participant?.name || 'Customer'}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] whitespace-nowrap ml-2 font-medium flex items-center gap-1",
                                                    isActive ? "text-primary-100" : "text-neutral-400"
                                                )}>
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(conv.updatedAt), 'HH:mm')}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-xs truncate",
                                                isActive ? "text-white/80" : "text-neutral-500",
                                                hasUnread && !isActive && "font-bold text-neutral-900"
                                            )}>
                                                {conv.lastMessage?.content || 'New conversation'}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Window */}
                <div className="flex-1 h-full min-w-0">
                    <AnimatePresence mode="wait">
                        {activeConversationId ? (
                            <motion.div
                                key={activeConversationId}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full flex flex-col pt-0"
                            >
                                {activeConversation && (
                                    <div className="flex items-center justify-between px-6 py-3 bg-white border border-neutral-200 rounded-t-3xl mb-1 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                {(activeConversation.participants?.find(p => p._id !== user?._id) || activeConversation.participants?.[0])?.name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                                                    {(activeConversation.participants?.find(p => p._id !== user?._id) || activeConversation.participants?.[0])?.name || 'Customer'}
                                                </p>
                                                <Badge variant={activeConversation.status === 'closed' ? 'error' : 'success'} size="sm" className="h-4 text-[10px]">
                                                    {activeConversation.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={activeConversation.status === 'closed' ? 'primary' : 'outline'}
                                            className="h-8 text-xs"
                                            isLoading={isUpdatingStatus}
                                            onClick={() => handleStatusUpdate(activeConversation._id, activeConversation.status === 'closed' ? 'reopen' : 'close')}
                                        >
                                            {activeConversation.status === 'closed' ? 'Reopen Chat' : 'Close Ticket'}
                                        </Button>
                                    </div>
                                )}
                                <ChatWindow
                                    conversationId={activeConversationId}
                                    className="flex-1 max-h-none min-h-0 rounded-b-3xl border-t-0"
                                    onClose={() => setActiveConversationId(null)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center p-12"
                            >
                                <div className="w-24 h-24 bg-primary-50 rounded-[40px] flex items-center justify-center text-5xl mb-6 shadow-inner">
                                    👋
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Select a Conversation</h3>
                                <p className="max-w-xs text-neutral-500 font-medium leading-relaxed">
                                    Choose a message from the left to start responding to customer inquiries in real-time.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminChatPage;
