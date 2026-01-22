import { api } from '../../../core/api/api';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilter } from '../interfaces/Department';

/**
 * Servicio para gestionar departamentos
 * 
 * Proporciona métodos para realizar operaciones CRUD sobre departamentos.
 */
export const departmentService = {
    /**
     * Obtiene todos los departamentos
     * @param filters - Filtros opcionales
     * @returns Lista de departamentos
     */
    async getAll(filters?: DepartmentFilter): Promise<Department[]> {
        const params = new URLSearchParams();

        if (filters?.search) {
            params.append('search', filters.search);
        }

        if (filters?.estado !== undefined && filters.estado !== 'all') {
            params.append('filter[estado]', filters.estado.toString());
        }

        const response = await api.get<Department[]>(`/departments?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtiene un departamento por ID
     * @param id - ID del departamento
     * @returns Departamento encontrado
     */
    async getById(id: number): Promise<Department> {
        const response = await api.get<Department>(`/departments/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo departamento
     * @param data - Datos del departamento
     * @returns Departamento creado
     */
    async create(data: CreateDepartmentDto): Promise<Department> {
        const response = await api.post<Department>('/departments', data);
        return response.data;
    },

    /**
     * Actualiza un departamento existente
     * @param id - ID del departamento
     * @param data - Datos a actualizar
     * @returns Departamento actualizado
     */
    async update(id: number, data: UpdateDepartmentDto): Promise<Department> {
        const response = await api.put<Department>(`/departments/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un departamento
     * @param id - ID del departamento
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/departments/${id}`);
    }
};
