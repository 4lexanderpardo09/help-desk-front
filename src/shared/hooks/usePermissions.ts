import { useAuth } from '../../modules/auth/context/useAuth';

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
    const { user } = useAuth();

    /**
     * Verifica si el usuario tiene un permiso específico
     * @param action - Acción del permiso (ej: 'view:assigned', 'create', 'update')
     * @param subject - Sujeto del permiso (ej: 'Ticket', 'User')
     * @returns true si el usuario tiene el permiso
     */
    const can = (action: string, subject: string): boolean => {
        if (!user || !user.permissions) {
            return false;
        }

        // Verificar si tiene el permiso específico
        const hasPermission = user.permissions.some(
            (p) => p.action === action && p.subject === subject
        );

        // Verificar si tiene permiso 'manage' (que implica todos los permisos)
        const hasManagePermission = user.permissions.some(
            (p) => p.action === 'manage' && p.subject === subject
        );

        return hasPermission || hasManagePermission;
    };

    /**
     * Verifica si el usuario tiene al menos uno de los permisos especificados
     * @param permissions - Array de [action, subject]
     * @returns true si el usuario tiene al menos uno de los permisos
     */
    const canAny = (permissions: Array<[string, string]>): boolean => {
        return permissions.some(([action, subject]) => can(action, subject));
    };

    /**
     * Verifica si el usuario tiene todos los permisos especificados
     * @param permissions - Array de [action, subject]
     * @returns true si el usuario tiene todos los permisos
     */
    const canAll = (permissions: Array<[string, string]>): boolean => {
        return permissions.every(([action, subject]) => can(action, subject));
    };

    return {
        can,
        canAny,
        canAll,
        permissions: user?.permissions || []
    };
}
