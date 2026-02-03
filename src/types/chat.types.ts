import type { User } from './auth.types';

export interface Message {
    _id: string;
    conversationId: string;
    sender: User;
    content: string;
    attachments?: string[];
    readBy: string[];
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    lastMessage?: {
        content: string;
        sentAt: string;
    };
    unreadCount?: number;
    status: 'active' | 'closed' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageInput {
    content: string;
    attachments?: string[];
}

export interface StartSupportChatInput {
    reason: string;
    orderId?: string;
}
