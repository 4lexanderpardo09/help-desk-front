import { api } from '../../../core/api/api';
import type { MappingRule, CreateMappingRuleDto, UpdateMappingRuleDto, MappingRuleFilter } from '../interfaces/MappingRule';
import type { PaginatedResponse } from '../../../shared/interfaces/PaginatedResponse';

/**
 * Servicio para gestionar reglas de mapeo
 */
export const mappingRuleService = {
    /**
     * Obtiene todas las reglas de mapeo
     * @param filters - Filtros opcionales
     */
    async getAll(filters?: MappingRuleFilter): Promise<PaginatedResponse<MappingRule>> {
        const params = new URLSearchParams();

        if (filters?.search) {
            params.append('search', filters.search);
        }

        if (filters?.estado !== undefined && filters.estado !== 'all') {
            params.append('filter[estado]', filters.estado.toString());
        }

        if (filters?.subcategoriaId !== undefined && filters.subcategoriaId !== 'all') {
            params.append('filter[subcategoriaId]', filters.subcategoriaId.toString());
        }

        if (filters?.page) {
            params.append('page', filters.page.toString());
        }

        if (filters?.limit) {
            params.append('limit', filters.limit.toString());
        }

        // Incluir relaciones
        params.append('included', 'subcategoria,creadores.cargo,asignados.cargo,creadoresPerfil.perfil');

        const response = await api.get<any>(`/reglas-mapeo?${params.toString()}`);

        // Normalización de la respuesta
        const rawData = response.data;
        const data: MappingRule[] = rawData.data || (Array.isArray(rawData) ? rawData : []);

        // Extraer metadata con fallbacks
        const total = rawData.total ?? rawData.meta?.total ?? data.length;
        const page = rawData.page ?? rawData.meta?.page ?? filters?.page ?? 1;
        const limit = rawData.limit ?? rawData.meta?.limit ?? filters?.limit ?? 10;
        const totalPages = rawData.totalPages ?? rawData.meta?.totalPages ?? rawData.lastPage ?? rawData.meta?.lastPage ?? Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                lastPage: totalPages
            }
        };
    },

    /**
     * Obtiene una regla de mapeo por ID
     */
    async getById(id: number): Promise<MappingRule> {
        const params = new URLSearchParams();
        params.append('included', 'subcategoria,creadores.cargo,asignados.cargo,creadoresPerfil.perfil');

        const response = await api.get<MappingRule>(`/reglas-mapeo/${id}?${params.toString()}`);
        return response.data;
    },

    /**
     * Crea una nueva regla de mapeo
     */
    async create(data: CreateMappingRuleDto): Promise<MappingRule> {
        const response = await api.post<MappingRule>('/reglas-mapeo', data);
        return response.data;
    },

    /**
     * Actualiza una regla de mapeo existente
     */
    async update(id: number, data: UpdateMappingRuleDto): Promise<MappingRule> {
        const response = await api.put<MappingRule>(`/reglas-mapeo/${id}`, data);
        return response.data;
    },

    /**
     * Elimina una regla de mapeo (soft delete)
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/reglas-mapeo/${id}`);
    }
};
