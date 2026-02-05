import type { User } from './auth.types';

export const EMESSAGE_TYPE = {
    TEXT: 'text',
    IMAGE: 'image',
    ORDER: 'order',
    LOCATION: 'location',
} as const;

export type EMESSAGE_TYPE = typeof EMESSAGE_TYPE[keyof typeof EMESSAGE_TYPE];

export interface ChatAttachment {
    url: string;
    publicId?: string;
    type: string;
    name: string;
    size: number;
}

export interface Message {
    _id: string;
    conversation: string;
    sender: User;
    content: string;
    type: EMESSAGE_TYPE;
    attachments?: ChatAttachment[];
    replyTo?: string;
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
    type?: EMESSAGE_TYPE;
    attachments?: ChatAttachment[];
    replyTo?: string;
}

export interface StartSupportChatInput {
    branchId: string;
}

export interface StartRiderChatInput {
    orderId: string;
}
