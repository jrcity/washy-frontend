import api from '../lib/axios';
import type { Task, CreateTaskInput, AssignTaskInput } from '../types/task.types';
import type { Pagination } from '../types';

export const tasksService = {
    getTasks: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        type?: string;
        assignee?: string;
    }) => {
        const response = await api.get<{
            success: boolean;
            data: { tasks: Task[]; pagination: Pagination };
        }>('/tasks', { params });
        return response.data;
    },

    getMyTasks: async () => {
        const response = await api.get<{
            success: boolean;
            data: Task[];
        }>('/tasks/my-tasks');
        return response.data;
    },

    createTask: async (data: CreateTaskInput) => {
        const response = await api.post<{
            success: boolean;
            data: Task;
        }>('/tasks', data);
        return response.data;
    },

    getTask: async (id: string) => {
        const response = await api.get<{
            success: boolean;
            data: Task;
        }>(`/tasks/${id}`);
        return response.data;
    },

    startTask: async (id: string) => {
        const response = await api.patch<{
            success: boolean;
            data: Task;
        }>(`/tasks/${id}/start`);
        return response.data;
    },

    completeTask: async (id: string) => {
        const response = await api.patch<{
            success: boolean;
            data: Task;
        }>(`/tasks/${id}/complete`);
        return response.data;
    },

    assignTask: async (id: string, data: AssignTaskInput) => {
        const response = await api.patch<{
            success: boolean;
            data: Task;
        }>(`/tasks/${id}/assign`, data);
        return response.data;
    },
};
