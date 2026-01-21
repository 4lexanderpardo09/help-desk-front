import { api } from '../../../core/api/api';
import type { Company } from '../interfaces/Company';

export const companyService = {
    async getCompanies(): Promise<Company[]> {
        const response = await api.get('/companies', {
            params: {
                'filter[estado]': 1
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;
        return Array.isArray(data) ? data : (data.data || []);
    }
};
