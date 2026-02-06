import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuthContext } from '@/context/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import { Input, Badge, Spinner, Button, Modal } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { format } from 'date-fns';
import { Users, Search, MessageSquare, Filter, Clock, ArrowLeft } from 'lucide-react';
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
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [closeReason, setCloseReason] = useState('');
    const [idToClose, setIdToClose] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filteredConversations = conversations.filter(conv =>
        conv.participants?.some(p => p.name.toLowerCase().includes(search.toLowerCase())) ||
        conv.lastMessage?.content?.toLowerCase().includes(search.toLowerCase())
    );

    const activeConversation = conversations.find(c => c._id === activeConversationId);

    const handleStatusUpdate = async (conversationId: string, action: 'close' | 'reopen') => {
        if (action === 'close') {
            setIdToClose(conversationId);
            setIsCloseModalOpen(true);
            return;
        }

        setIsUpdatingStatus(true);
        try {
            await chatService.updateConversationStatus(conversationId, action);
            toast.success(`Conversation reopened successfully`);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const confirmCloseTicket = async () => {
        if (!idToClose) return;
        setIsUpdatingStatus(true);
        try {
            await chatService.updateConversationStatus(idToClose, 'close', closeReason || 'Issue resolved');
            toast.success(`Conversation closed successfully`);
            setIsCloseModalOpen(false);
            setCloseReason('');
            setIdToClose(null);
        } catch (error) {
            toast.error('Failed to close ticket');
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
            <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-18rem)] flex flex-col lg:flex-row gap-6 relative">
                {/* Sidebar List */}
                <div className={cn(
                    "flex-col bg-card rounded-3xl border border-border shadow-xl overflow-hidden transition-all duration-300",
                    activeConversationId ? "hidden lg:flex w-96" : "flex w-full lg:w-96"
                )}>
                    <div className="p-6 border-b border-border bg-card/80 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-2xl text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
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
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                    placeholder="Search chats..."
                                    className="pl-10 h-11 bg-muted border-none rounded-2xl focus-within:bg-card transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="w-11 h-11 rounded-2xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                        {isLoadingConversations ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Spinner size="lg" className="text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Loading inbox...</p>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                                    <Users className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="font-bold text-foreground mb-1">No chats found</p>
                                <p className="text-sm text-muted-foreground">Wait for users to start a support session.</p>
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
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "hover:bg-muted/50 text-muted-foreground"
                                        )}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-2 border-background shadow-sm",
                                                isActive ? "bg-background/20 text-primary-foreground" : "bg-primary/10 text-primary"
                                            )}>
                                                {participant?.name?.charAt(0) || '?'}
                                            </div>
                                            {hasUnread && !isActive && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] text-destructive-foreground font-bold border-2 border-background">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={cn(
                                                    "font-bold truncate",
                                                    isActive ? "text-primary-foreground" : "text-foreground"
                                                )}>
                                                    {participant?.name || 'Customer'}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] whitespace-nowrap ml-2 font-medium flex items-center gap-1",
                                                    isActive ? "text-primary-foreground/80" : "text-muted-foreground/60"
                                                )}>
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(conv.updatedAt), 'HH:mm')}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-xs truncate",
                                                isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                                                hasUnread && !isActive && "font-bold text-foreground"
                                            )}>
                                                {conv.lastMessage?.content || 'New conversation'}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-foreground rounded-r-full"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Window */}
                <div className={cn(
                    "flex-1 h-full min-w-0 transition-all duration-300",
                    !activeConversationId ? "hidden lg:block" : "block"
                )}>
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
                                    <div className="flex items-center justify-between px-4 lg:px-6 py-3 bg-card border border-border rounded-t-3xl mb-1 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="lg:hidden p-2 h-auto rounded-xl"
                                                onClick={() => setActiveConversationId(null)}
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            </Button>
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {(activeConversation.participants?.find(p => p._id !== user?._id) || activeConversation.participants?.[0])?.name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground truncate max-w-[200px]">
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
                                className="h-full bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center text-center p-12"
                            >
                                <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center text-5xl mb-6 shadow-inner">
                                    👋
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Select a Conversation</h3>
                                <p className="max-w-xs text-muted-foreground font-medium leading-relaxed">
                                    Choose a message from the left to start responding to customer inquiries in real-time.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Modal
                isOpen={isCloseModalOpen}
                onClose={() => setIsCloseModalOpen(false)}
                title="Close Support Ticket"
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        <Button variant="ghost" onClick={() => setIsCloseModalOpen(false)}>Cancel</Button>
                        <Button isLoading={isUpdatingStatus} onClick={confirmCloseTicket}>Close Ticket</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Please provide a reason for closing this conversation. This will be visible to the customer.
                    </p>
                    <Input
                        label="Reason"
                        placeholder="e.g. Issue resolved, Customer satisfied..."
                        value={closeReason}
                        onChange={(e) => setCloseReason(e.target.value)}
                    />
                </div>
            </Modal>
        </PageWrapper>
    );
};

export default AdminChatPage;
