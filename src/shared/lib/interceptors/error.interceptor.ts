import { AxiosError, type AxiosResponse } from 'axios';

/**
 * Manejador de éxito para respuestas.
 * Simplemente pasa la respuesta tal cual.
 */
export const responseSuccessHandler = (response: AxiosResponse) => response;

/**
 * Manejador de errores global para respuestas.
 * 
 * Detecta errores 401 (No autorizado) y podría redirigir al login
 * o limpiar el almacenamiento local.
 * 
 * @param error Error de Axios.
 * @returns Promesa rechazada con el error.
 */
export const responseErrorHandler = (error: AxiosError) => {
    // Optional: Redirect to login on 401, but careful with loops
    if (error.response?.status === 401) {
        // console.warn('Sesión expirada o inválida. Redirigiendo...');
        // localStorage.removeItem('token');
        // window.location.href = '/login';
    }
    return Promise.reject(error);
};
