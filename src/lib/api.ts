import axios from 'axios';
import { authRequestInterceptor } from './interceptors/auth.interceptor';
import { responseErrorHandler, responseSuccessHandler } from './interceptors/error.interceptor';

/**
 * Instancia global de Axios configurada para la API.
 * 
 * - baseURL: Se determina dinámicamente usando variables de entorno o un string vacío para usar el proxy en desarrollo.
 * - headers: Content-Type por defecto application/json.
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Use proxy in dev
    headers: {
        'Content-Type': 'application/json',
    },
});

// Registrar interceptores
api.interceptors.request.use(
    authRequestInterceptor,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    responseSuccessHandler,
    responseErrorHandler
);
