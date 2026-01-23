import { api } from '../../../core/api/api';
import type { Zone, CreateZoneDto, UpdateZoneDto, ZoneFilter, ZoneListResponse } from '../interfaces/Zone';

export const zoneService = {
    async getZones(filter: ZoneFilter = {}): Promise<ZoneListResponse> {
        const params: Record<string, string | number> = {};

        params.page = filter.page || 1;
        params.limit = filter.limit || 10;

        if (filter.search) {
            params['filter[nombre]'] = filter.search;
        }

        if (filter.estado !== undefined && filter.estado !== 'all') {
            params['filter[estado]'] = filter.estado;
        }

        const response = await api.get<any>('/zones', { params });

        // Handle pagination metadata robustly
        const rawData = response.data;
        const list = Array.isArray(rawData) ? rawData : (rawData.data || []);

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

    async getAll(): Promise<Zone[]> {
        const response = await api.get<Zone[]>('/zones', {
            params: { limit: 1000, 'filter[estado]': 1 }
        });
        const data = response.data as any;
        return Array.isArray(data) ? data : (data.data || []);
    },

    async getZone(id: number): Promise<Zone> {
        const response = await api.get<Zone>(`/zones/${id}`);
        return response.data;
    },

    async createZone(data: CreateZoneDto): Promise<Zone> {
        const response = await api.post<Zone>('/zones', data);
        return response.data;
    },

    async updateZone(id: number, data: UpdateZoneDto): Promise<Zone> {
        const response = await api.put<Zone>(`/zones/${id}`, data);
        return response.data;
    },

    async deleteZone(id: number): Promise<void> {
        await api.delete(`/zones/${id}`);
    }
};
