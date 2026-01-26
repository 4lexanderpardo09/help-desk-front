import { api } from '../../../core/api/api';
import type { LoginCredentials, AuthResponse } from '../interfaces/Auth';
import type { User } from '../../users/interfaces/User';

/**
 * Servicio de Autenticación.
 * Maneja el inicio de sesión, obtención de perfil y cierre de sesión.
 */
export const authService = {
    /**
     * Inicia sesión con credenciales de usuario.
     * @param credentials Objeto con email y password.
     * @returns Promesa con la respuesta de autenticación (token).
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Obtiene el perfil del usuario autenticado actual.
     * @returns Promesa con los datos completos del usuario (incluyendo roles y permisos).
     */
    async getProfile(): Promise<User> {
        const response = await api.get<any>('/auth/profile');
        const raw = response.data;

        // Map backend snake_case to frontend camelCase User interface
        // Handling both legacy/raw fields and potentially normalized ones
        return {
            id: raw.usu_id || raw.id,
            cedula: raw.usu_cedula || raw.cedula || '',
            nombre: raw.nombre || raw.usu_nombre || '',
            apellido: raw.apellido || raw.usu_apellido || '',
            email: raw.usu_correo || raw.email || '',
            rolId: raw.rol_id || raw.rolId,
            regionalId: raw.reg_id || raw.regionalId,
            cargoId: raw.car_id || raw.cargoId,
            departamentoId: raw.dp_id || raw.departamentoId,
            esNacional: raw.es_nacional === 1 || raw.esNacional === true,
            estado: raw.estado || 1, // Default active if missing

            // Nested relations if present
            role: raw.role,
            regional: raw.regional,
            cargo: raw.cargo,
            departamento: raw.departamento,
            permissions: raw.permissions || []
        };
    },

    /**
     * Cierra la sesión localmente eliminando el token.
     */
    logout() {
        localStorage.removeItem('token');
    }
};
