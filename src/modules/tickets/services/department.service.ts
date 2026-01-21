import { api } from '../../../core/api/api';
import type { Department } from '../interfaces/Department';

export const departmentService = {
    async getDepartments(): Promise<Department[]> {
        const response = await api.get('/departments', {
            params: {
                'filter[estado]': 1
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;
        return Array.isArray(data) ? data : (data.data || []);
    }
};
