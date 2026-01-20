import axios from 'axios';

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

// Request interceptor to add the auth token to every request
/**
 * Interceptor de Solicitud (Request).
 * 
 * Inyecta automáticamente el token JWT almacenado en localStorage
 * en el encabezado 'Authorization' de cada petición saliente.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global errors (like 401 Unauthorized)
/**
 * Interceptor de Respuesta (Response).
 * 
 * Maneja errores globales.
 * TODO: Implementar lógica de redirección automática al login si se recibe un 401.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optional: Redirect to login on 401, but careful with loops
        if (error.response?.status === 401) {
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
