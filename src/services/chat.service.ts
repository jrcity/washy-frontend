import api from '@/lib/axios';
import type {
    Conversation,
    Message,
    SendMessageInput,
    StartSupportChatInput,
    StartRiderChatInput,
} from '@/types/chat.types';
import type { ApiResponse } from '@/types/api.types';

export const chatService = {
    getConversations: async () => {
        const response = await api.get<ApiResponse<Conversation[]>>('/chat/conversations');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get<ApiResponse<{ count: number }>>('/chat/unread-count');
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
        const response = await api.patch<ApiResponse<Conversation>>(`/chat/conversations/${id}/${action}`);
        return response.data;
    },

    getMessages: async (id: string, page?: number) => {
        const response = await api.get<{
            success: boolean;
            data: {
                messages: Message[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            };
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
        const response = await api.post<ApiResponse<Conversation>>('/chat/support/start', data);
        return response.data;
    },

    startRiderChat: async (data: StartRiderChatInput) => {
        const response = await api.post<ApiResponse<Conversation>>('/chat/rider/start', data);
        return response.data;
    },

    deleteMessage: async (conversationId: string, messageId: string) => {
        const response = await api.delete<ApiResponse<null>>(`/chat/conversations/${conversationId}/messages/${messageId}`);
        return response.data;
    },
};
