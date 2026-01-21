import { api } from '../../core/api/api';
import type { Department, Position, Region } from '../interfaces/Catalog';

interface ListResponse<T> {
    data: T[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class DepartmentService {
    async getAllActive(): Promise<Department[]> {
        const { data } = await api.get<ListResponse<Department>>('/departments', {
            params: {
                'filter[estado]': 1,
                limit: 100 // Reasonable limit for dropdowns
            }
        });
        return Array.isArray(data) ? data : data.data || [];
    }
}

class PositionService {
    async getAllActive(): Promise<Position[]> {
        const { data } = await api.get<ListResponse<Position>>('/positions', {
            params: {
                'filter[estado]': 1,
                limit: 100
            }
        });
        return Array.isArray(data) ? data : data.data || [];
    }
}

class RegionService {
    async getAllActive(): Promise<Region[]> {
        const { data } = await api.get<ListResponse<Region>>('/regions', {
            params: {
                'filter[estado]': 1,
                limit: 100
            }
        });
        return Array.isArray(data) ? data : data.data || [];
    }
}

export const departmentService = new DepartmentService();
export const positionService = new PositionService();
export const regionService = new RegionService();
