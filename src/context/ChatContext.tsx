import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/storage';
import { useAuthContext } from './AuthContext';
import { chatService } from '@/services/chat.service';
import { EMESSAGE_TYPE } from '@/types/chat.types';
import type { Message, Conversation } from '@/types/chat.types';
import toast from 'react-hot-toast';

interface ChatContextType {
    socket: Socket | null;
    isConnected: boolean;
    conversations: Conversation[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    messages: Message[];
    sendMessage: (content: string, type?: EMESSAGE_TYPE, attachments?: any[]) => Promise<void>;
    isLoadingConversations: boolean;
    isLoadingMessages: boolean;
    typingUsers: Record<string, string[]>; // conversationId -> userIds[]
    markAsRead: (conversationId: string) => void;
    setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthContext();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

    const activeConvRef = useRef<string | null>(null);
    activeConvRef.current = activeConversationId;

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingConversations(true);
        try {
            const response = await chatService.getConversations();
            if (response.success && response.data) {
                setConversations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setIsLoadingConversations(false);
        }
    }, [isAuthenticated]);

    // Fetch messages for active conversation
    const fetchMessages = useCallback(async (conversationId: string) => {
        setIsLoadingMessages(true);
        try {
            const response = await chatService.getMessages(conversationId);
            if (response.success && response.data?.messages) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    // Effect for socket connection and listeners
    useEffect(() => {
        if (!isAuthenticated) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const token = getToken();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const socketUrl = apiUrl.split('/api')[0];

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('Chat socket connected');
            setIsConnected(true);
            // Re-join active conversation room if one exists
            if (activeConvRef.current) {
                newSocket.emit('join:conversation', activeConvRef.current);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Chat socket disconnected');
            setIsConnected(false);
        });

        // Backend event: message:received (emitted to conversation room)
        newSocket.on('message:received', (message: Message) => {
            const conversationId = message.conversation;
            if (conversationId === activeConvRef.current) {
                setMessages(prev => {
                    // Prevent duplicates
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                // Automatically mark as read if we are looking at it
                newSocket.emit('messages:read', { conversationId });
            }
        });

        // Backend event: message:new (emitted to personal user room for notifications)
        newSocket.on('message:new', ({ conversationId: cid, message }: { conversationId: string, message: Message }) => {
            const conversationId = cid || message.conversation;

            // FALLBACK: If we are in this conversation, update messages list too
            // This is critical for users who aren't yet in the conversation room (e.g. Managers joining)
            if (conversationId === activeConvRef.current) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                newSocket.emit('messages:read', { conversationId });
            }

            // Update unread count if we are not in this conversation
            if (conversationId !== activeConvRef.current) {
                // Potential sound or toast
            }

            // Update conversations list globally
            setConversations(prev => {
                const index = prev.findIndex(c => c._id === conversationId);
                const updated = [...prev];

                if (index !== -1) {
                    updated[index] = {
                        ...updated[index],
                        lastMessage: {
                            content: message.content,
                            sentAt: message.createdAt
                        },
                        updatedAt: message.createdAt,
                        unreadCount: conversationId === activeConvRef.current
                            ? (updated[index].unreadCount || 0)
                            : (updated[index].unreadCount || 0) + 1
                    };
                    const item = updated.splice(index, 1)[0];
                    return [item, ...updated];
                } else {
                    // Might be a new conversation, ideally fetch list again
                    fetchConversations();
                    return prev;
                }
            });

            // Show toast if not active
            if (conversationId !== activeConvRef.current && message.sender?._id !== user?._id) {
                toast(`New message from ${message.sender?.name || 'Washy System'}`, { icon: '💬' });
            }
        });

        // Backend events: typing indicators
        newSocket.on('typing:started', ({ userId, conversationId: cid }: { userId: string, conversationId?: string }) => {
            if (userId === user?._id) return;
            const convId = cid || activeConvRef.current;
            if (!convId) return;

            setTypingUsers(prev => ({
                ...prev,
                [convId]: [...(prev[convId] || []).filter(id => id !== userId), userId]
            }));
        });

        newSocket.on('typing:stopped', ({ userId, conversationId: cid }: { userId: string, conversationId?: string }) => {
            if (userId === user?._id) return;
            const convId = cid || activeConvRef.current;
            if (!convId) return;

            setTypingUsers(prev => ({
                ...prev,
                [convId]: (prev[convId] || []).filter(id => id !== userId)
            }));
        });

        // Backend event: messages:marked-read
        newSocket.on('messages:marked-read', ({ userId, conversationId: cid }: { userId: string, conversationId: string }) => {
            if (userId !== user?._id) {
                // Potential UI update to show "read" receipt
            }
        });

        // Backend event: error
        newSocket.on('error', (err: any) => {
            console.error('Socket error:', err);
            toast.error(err.message || 'Chat error occurred');
        });

        setSocket(newSocket);
        fetchConversations();

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, fetchConversations, user?._id]);

    // Handle active conversation change (Join/Leave rooms)
    useEffect(() => {
        if (!socket) return;

        if (activeConversationId) {
            socket.emit('join:conversation', activeConversationId);
            socket.emit('messages:read', { conversationId: activeConversationId });
            fetchMessages(activeConversationId);

            // Clear unread for this conv in local state
            setConversations(prev => prev.map(c =>
                c._id === activeConversationId ? { ...c, unreadCount: 0 } : c
            ));
        }

        return () => {
            if (activeConversationId) {
                socket.emit('leave:conversation', activeConversationId);
            }
        };
    }, [activeConversationId, socket, fetchMessages]);

    const sendMessage = async (content: string, type: EMESSAGE_TYPE = EMESSAGE_TYPE.TEXT, attachments?: any[]) => {
        if (!activeConversationId || !socket || !isConnected) {
            toast.error('Chat not connected');
            return;
        }

        // Emit message:send event to backend
        socket.emit('message:send', {
            conversationId: activeConversationId,
            content,
            type,
            attachments
        });

        // Stop typing indicator on send
        socket.emit('typing:stop', activeConversationId);
    };

    const markAsRead = (conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('messages:read', { conversationId });
        }
    };

    // Helper for typing indicator (could be called from ChatWindow)
    const setTyping = (isTyping: boolean) => {
        if (socket && isConnected && activeConversationId) {
            if (isTyping) {
                socket.emit('typing:start', activeConversationId);
            } else {
                socket.emit('typing:stop', activeConversationId);
            }
        }
    };

    const value = {
        socket,
        isConnected,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        isLoadingConversations,
        isLoadingMessages,
        typingUsers,
        markAsRead,
        setTyping
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
