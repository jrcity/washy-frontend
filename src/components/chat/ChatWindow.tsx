import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Paperclip, X, MoreVertical, Smile, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Spinner } from '@/components/ui';
import { useAuthContext } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
    conversationId: string;
    onClose?: () => void;
    className?: string;
}

interface MessageForm {
    content: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose, className }) => {
    const { user } = useAuthContext();
    const {
        messages,
        sendMessage,
        setActiveConversationId,
        activeConversationId,
        isLoadingMessages,
        isConnected,
        typingUsers,
        setTyping
    } = useChat();

    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { register, handleSubmit, reset } = useForm<MessageForm>();

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        bottomRef.current?.scrollIntoView({ behavior });
    }, []);

    // Listen to scroll to show/hide "Scroll to Bottom" button
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        setShowScrollButton(!isNearBottom);
    };

    useEffect(() => {
        setActiveConversationId(conversationId);
        return () => setActiveConversationId(null);
    }, [conversationId, setActiveConversationId]);

    const hasInitialScrolled = useRef<string | null>(null);

    useEffect(() => {
        // Auto-scroll on new messages
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
            const isFirstLoad = hasInitialScrolled.current !== conversationId && messages.length > 0;

            if (isNearBottom || isFirstLoad) {
                scrollToBottom(isFirstLoad ? 'auto' : 'smooth');
                if (isFirstLoad) {
                    hasInitialScrolled.current = conversationId;
                }
            }
        }
    }, [messages, conversationId, scrollToBottom]);

    // Clear initial scroll ref when conversation changes
    useEffect(() => {
        hasInitialScrolled.current = null;
    }, [conversationId]);

    const onSubmit = async (data: MessageForm) => {
        if (!data.content.trim()) return;
        await sendMessage(data.content);
        reset();
        setTyping(false);
    };

    const isTyping = (typingUsers[conversationId] || []).length > 0;

    return (
        <div className={cn(
            "flex flex-col h-full min-h-[500px] border border-border rounded-3xl bg-card shadow-2xl overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-card/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
                            WS
                        </div>
                        <div className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background shadow-sm",
                            isConnected ? "bg-success" : "bg-muted-foreground/30"
                        )} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground leading-tight">Washy Support</h3>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            {isConnected ? "Online" : "Connecting..."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0">
                        <MoreVertical className="w-5 h-5 text-neutral-400" />
                    </Button>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-9 h-9 p-0">
                            <X className="w-5 h-5 text-neutral-400" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/30 custom-scrollbar relative"
            >
                {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Spinner size="lg" className="text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Retrieving conversation...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 lg:px-10">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-2xl mb-4">💬</div>
                        <h4 className="font-bold text-foreground mb-1">Start a conversation</h4>
                        <p className="text-sm text-muted-foreground">Ask us anything about your laundry order or service.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender?._id === user?._id;
                            const currentSenderId = msg.sender?._id || 'system';
                            const prevSenderId = idx > 0 ? messages[idx - 1].sender?._id || 'system' : null;
                            const showAvatar = idx === 0 || prevSenderId !== currentSenderId;

                            return (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn(
                                        "flex items-end gap-2",
                                        isMe ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-background shadow-sm">
                                            {showAvatar ? (msg.sender?.name || 'S').charAt(0) : ''}
                                        </div>
                                    )}

                                    <div className={cn(
                                        "flex flex-col group max-w-[80%] relative",
                                        isMe ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "px-4 py-2.5 rounded-2xl text-sm transition-all duration-300 shadow-sm",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-card border border-border text-foreground rounded-bl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 px-1 tracking-tight">
                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-muted-foreground/60"
                    >
                        <div className="flex gap-1 ml-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} className="h-2" />

                {/* Scroll to Bottom Button */}
                <AnimatePresence>
                    {showScrollButton && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            onClick={() => scrollToBottom('smooth')}
                            className="absolute bottom-24 right-8 w-10 h-10 rounded-full bg-card shadow-xl border border-border flex items-center justify-center text-primary z-20 hover:bg-muted transition-colors group"
                        >
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-card border-t border-border">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-end gap-2 bg-muted p-2 rounded-2xl border border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300"
                >
                    <div className="flex items-center gap-1 mb-1">
                        <Button type="button" variant="ghost" size="sm" className="rounded-xl w-8 h-8 p-0 text-muted-foreground/60 hover:text-muted-foreground">
                            <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="rounded-xl w-8 h-8 p-0 text-muted-foreground/60 hover:text-muted-foreground">
                            <Smile className="w-4 h-4" />
                        </Button>
                    </div>

                    <textarea
                        {...register('content')}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none max-h-32"
                        autoComplete="off"
                        onFocus={() => setTyping(true)}
                        onBlur={() => setTyping(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                    />

                    <button
                        type="submit"
                        disabled={!isConnected}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
                            isConnected
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
                                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <p className="text-[10px] text-center text-muted-foreground/60 mt-2 font-medium">
                    Shift + Enter for new line
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
