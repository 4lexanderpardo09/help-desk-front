import { type InternalAxiosRequestConfig } from 'axios';

/**
 * Interceptor de Solicitud (Request).
 * 
 * Inyecta automáticamente el token JWT almacenado en localStorage
 * en el encabezado 'Authorization' de cada petición saliente.
 * 
 * @param config Configuración de la solicitud Axios.
 * @returns Configuración modificada con el token (si existe).
 */
export const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
