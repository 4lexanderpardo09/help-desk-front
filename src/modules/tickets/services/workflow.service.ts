import { api } from '../../../core/api/api';
import type { CheckStartFlowResponse } from '../interfaces/Workflow';

export const workflowService = {
    async checkStartFlow(subcategoryId: number): Promise<CheckStartFlowResponse> {
        const response = await api.get<CheckStartFlowResponse>(`/workflows/check-start-flow/${subcategoryId}`);
        return response.data;
    }
};
