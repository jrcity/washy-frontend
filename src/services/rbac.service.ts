import api from '@/lib/axios';
import type { Policy, CreatePolicyInput, CheckAccessInput, AccessCheckResult } from '@/types/rbac.types';

export const rbacService = {
    getPolicies: async () => {
        const response = await api.get<{
            success: boolean;
            data: Policy[];
        }>('/rbac');
        return response.data;
    },

    createPolicy: async (data: CreatePolicyInput) => {
        const response = await api.post<{
            success: boolean;
            data: Policy;
        }>('/rbac', data);
        return response.data;
    },

    getPolicy: async (id: string) => {
        const response = await api.get<{
            success: boolean;
            data: Policy;
        }>(`/rbac/${id}`);
        return response.data;
    },

    updatePolicy: async (id: string, data: Partial<CreatePolicyInput>) => {
        const response = await api.patch(`/rbac/${id}`, data);
        return response.data;
    },

    deletePolicy: async (id: string) => {
        const response = await api.delete(`/rbac/${id}`);
        return response.data;
    },

    checkAccess: async (data: CheckAccessInput) => {
        const response = await api.post<{
            success: boolean;
            data: AccessCheckResult;
        }>('/rbac/check-access', data);
        return response.data;
    },
};
