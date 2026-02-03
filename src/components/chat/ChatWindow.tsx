import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Paperclip, X, MoreVertical, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
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
        isLoadingMessages,
        isConnected,
        typingUsers,
        setTyping
    } = useChat();

    const bottomRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, reset } = useForm<MessageForm>();

    useEffect(() => {
        setActiveConversationId(conversationId);
        return () => setActiveConversationId(null);
    }, [conversationId, setActiveConversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onSubmit = async (data: MessageForm) => {
        if (!data.content.trim()) return;
        await sendMessage(data.content);
        reset();
        setTyping(false);
    };

    const isTyping = (typingUsers[conversationId] || []).length > 0;

    return (
        <div className={cn(
            "flex flex-col h-full min-h-[500px] border border-neutral-200 rounded-3xl bg-white shadow-2xl overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            WS
                        </div>
                        <div className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                            isConnected ? "bg-success-500" : "bg-neutral-300"
                        )} />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900 leading-tight">Washy Support</h3>
                        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50/30 custom-scrollbar">
                {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Spinner size="lg" className="text-primary-500" />
                        <p className="text-sm font-medium text-neutral-500">Retrieving conversation...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-10">
                        <div className="w-16 h-16 rounded-3xl bg-primary-50 flex items-center justify-center text-2xl mb-4">💬</div>
                        <h4 className="font-bold text-neutral-900 mb-1">Start a conversation</h4>
                        <p className="text-sm text-neutral-500">Ask us anything about your laundry order or service.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender._id === user?._id;
                            const showAvatar = idx === 0 || messages[idx - 1].sender._id !== msg.sender._id;

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
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-neutral-500 border border-white shadow-sm">
                                            {showAvatar ? msg.sender.name.charAt(0) : ''}
                                        </div>
                                    )}

                                    <div className={cn(
                                        "flex flex-col group max-w-[80%]",
                                        isMe ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "px-4 py-2.5 rounded-2xl text-sm transition-all duration-300 shadow-sm",
                                            isMe
                                                ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-none"
                                                : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] font-medium text-neutral-400 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        className="flex items-center gap-2 text-neutral-400"
                    >
                        <div className="flex gap-1 ml-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} className="h-2" />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-neutral-100">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-end gap-2 bg-neutral-50 p-2 rounded-2xl border border-neutral-200 focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all duration-300"
                >
                    <div className="flex items-center gap-1 mb-1">
                        <Button type="button" variant="ghost" size="sm" className="rounded-xl w-8 h-8 p-0 text-neutral-400 hover:text-neutral-600">
                            <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="rounded-xl w-8 h-8 p-0 text-neutral-400 hover:text-neutral-600">
                            <Smile className="w-4 h-4" />
                        </Button>
                    </div>

                    <textarea
                        {...register('content')}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none max-h-32"
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
                                ? "bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 active:scale-95"
                                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <p className="text-[10px] text-center text-neutral-400 mt-2 font-medium">
                    Shift + Enter for new line
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
