import { api } from '../../../core/api/api';
import type { Regional, CreateRegionalDto, UpdateRegionalDto, RegionalFilter, RegionalListResponse } from '../interfaces/Region';

export const regionService = {
    async getRegions(filter: RegionalFilter = {}): Promise<RegionalListResponse> {
        const params: Record<string, string | number> = {};

        params.page = filter.page || 1;
        params.limit = filter.limit || 10;

        if (filter.search) {
            params['filter[nombre]'] = filter.search; // Backend filters usually check specific fields or generic search
        }

        if (filter.estado !== undefined && filter.estado !== 'all') {
            params['filter[estado]'] = filter.estado;
        }

        if (filter.zonaId !== undefined && filter.zonaId !== 'all') {
            params['filter[zonaId]'] = filter.zonaId;
        }

        // Include relations
        params['included'] = 'zona';

        const response = await api.get<any>('/regions', { params });

        // Handle pagination metadata robustly
        const rawData = response.data;
        // Support array response (if no pagination) or object with data/meta
        const list = Array.isArray(rawData) ? rawData : (rawData.data || []);

        // Check standard meta, or root props (some controllers return flat props)
        const total = rawData.total ?? rawData.meta?.total ?? list.length;
        const page = rawData.page ?? rawData.meta?.page ?? params.page;
        const limit = rawData.limit ?? rawData.meta?.limit ?? params.limit;
        const totalPages = rawData.totalPages ?? rawData.meta?.totalPages ?? Math.ceil(total / Number(limit));

        return {
            data: list,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages
            }
        };
    },

    async getAll(): Promise<Regional[]> {
        const response = await api.get<Regional[]>('/regions', {
            params: { limit: 1000, 'filter[estado]': 1 }
        });
        const data = response.data as any;
        return Array.isArray(data) ? data : (data.data || []);
    },

    async getRegion(id: number): Promise<Regional> {
        const response = await api.get<Regional>(`/regions/${id}`, {
            params: { included: 'zona' }
        });
        return response.data;
    },

    async createRegion(data: CreateRegionalDto): Promise<Regional> {
        const response = await api.post<Regional>('/regions', data);
        return response.data;
    },

    async updateRegion(id: number, data: UpdateRegionalDto): Promise<Regional> {
        const response = await api.put<Regional>(`/regions/${id}`, data);
        return response.data;
    },

    async deleteRegion(id: number): Promise<void> {
        await api.delete(`/regions/${id}`);
    }
};
