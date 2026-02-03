import api from '@/lib/axios';
import type {
    Conversation,
    Message,
    SendMessageInput,
    StartSupportChatInput,
} from '@/types/chat.types';

export const chatService = {
    getConversations: async () => {
        const response = await api.get<{
            success: boolean;
            data: Conversation[];
        }>('/chat/conversations');
        return response.data;
    },

    getConversation: async (id: string, action?: 'close' | 'reopen') => {
        const params = action ? { action } : undefined;
        const response = await api.get<{
            success: boolean;
            data: Conversation;
        }>(`/chat/conversations/${id}`, { params });
        return response.data;
    },

    updateConversationStatus: async (id: string, action: 'close' | 'reopen') => {
        const response = await api.patch(`/chat/conversations/${id}`, null, {
            params: { action },
        });
        return response.data;
    },

    getMessages: async (id: string, page?: number) => {
        const response = await api.get<{
            success: boolean;
            data: Message[];
        }>(`/chat/conversations/${id}/messages`, { params: { page } });
        return response.data;
    },

    sendMessage: async (id: string, data: SendMessageInput) => {
        const response = await api.post<{
            success: boolean;
            data: Message;
        }>(`/chat/conversations/${id}/messages`, data);
        return response.data;
    },

    startSupportChat: async (data: StartSupportChatInput) => {
        const response = await api.post<{
            success: boolean;
            data: Conversation;
        }>('/chat/support/start', data);
        return response.data;
    },
};
