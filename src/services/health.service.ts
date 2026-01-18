import { api } from '@/lib/axios';

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

/**
 * Check API health
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};
