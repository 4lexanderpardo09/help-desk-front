
import { api } from './api';

// --- Interfaces ---

export interface Role {
    id: number;
    nombre: string;
    descripcion: string;
    estado: number;
}

/**
 * Defined set of actions that can be performed on a subject.
 * Used to populate UI dropdowns and validate input.
 */
export const PERMISSION_ACTIONS = ['manage', 'create', 'read', 'update', 'delete'] as const;
export type PermissionAction = typeof PERMISSION_ACTIONS[number];

export const PERMISSION_SUBJECTS = [
    'User', 'Ticket', 'Category', 'Subcategoria', 'Department',
    'Role', 'Profile', 'Regional', 'Company', 'Permission',
    'Zone', 'Priority', 'Position', 'Rule', 'Report', 'all'
] as const;

export type PermissionSubject = typeof PERMISSION_SUBJECTS[number];

/**
 * Represents a single permission definition in the system.
 */
export interface Permission {
    id: number;
    action: PermissionAction;
    subject: PermissionSubject; // e.g., 'User', 'Ticket', 'Report'
    descripcion: string;
}

export interface CreatePermissionDto {
    action: string;
    subject: string;
    descripcion?: string;
}

export interface CreateRoleDto {
    nombre: string;
    descripcion: string;
}

export interface UpdateRoleDto {
    nombre?: string;
    descripcion?: string;
    estado?: number;
}

// --- Service ---

/**
 * Service for handling Role-Based Access Control (RBAC) operations.
 * Includes methods for managing Roles and Permissions.
 */
export const rbacService = {
    // 1. Gestión de Roles

    /**
     * Fetches a paginated list of roles.
     * Handles API responses that might be wrapped in a generic data envelope.
     */
    async getRoles(params?: { page?: number; limit?: number; search?: string }): Promise<Role[]> {
        // En una implementación real, esto podría devolver { data: Role[], meta: ... }
        const response = await api.get<any>('/roles', { params });
        if (Array.isArray(response.data)) return response.data;
        return response.data?.data || [];
    },

    /**
     * Fetches details of a specific role by ID.
     */
    async getRole(id: number): Promise<Role> {
        const response = await api.get<Role>(`/roles/${id}`);
        return response.data;
    },

    async createRole(data: CreateRoleDto): Promise<Role> {
        const response = await api.post<Role>('/roles', data);
        return response.data;
    },

    async updateRole(id: number, data: UpdateRoleDto): Promise<Role> {
        const response = await api.put<Role>(`/roles/${id}`, data);
        return response.data;
    },

    async deleteRole(id: number): Promise<void> {
        await api.delete(`/roles/${id}`);
    },

    // 2. Asignación de Permisos a Roles

    /**
     * Fetches permissions assigned to a specific role.
     */
    async getRolePermissions(roleId: number): Promise<Permission[]> {
        const response = await api.get<any>(`/permissions/role/${roleId}`);
        if (Array.isArray(response.data)) return response.data;
        return response.data?.data || [];
    },

    /**
     * Assigns a set of permissions to a role.
     * Uses `permisoIds` payload property as expected by the backend.
     */
    async assignPermissions(roleId: number, permissionIds: number[]): Promise<void> {
        await api.put(`/permissions/role/${roleId}`, { permisoIds: permissionIds });
    },

    // 3. Gestión de Definiciones de Permisos (Catálogo)

    /**
     * Fetches the full catalog of available permission definitions.
     */
    async getPermissions(): Promise<Permission[]> {
        const response = await api.get<any>('/permissions');
        if (Array.isArray(response.data)) return response.data;
        return response.data?.data || [];
    },

    async createPermission(data: CreatePermissionDto): Promise<Permission> {
        const response = await api.post<Permission>('/permissions', data);
        return response.data;
    },

    async updatePermission(id: number, data: Partial<CreatePermissionDto>): Promise<Permission> {
        const response = await api.put<Permission>(`/permissions/${id}`, data);
        return response.data;
    },

    async deletePermission(id: number): Promise<void> {
        await api.delete(`/permissions/${id}`);
    }
};
