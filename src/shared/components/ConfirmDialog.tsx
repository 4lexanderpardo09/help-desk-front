import { IconAlertTriangle } from '@tabler/icons-react';
import { Button } from './Button';

/**
 * Props para el componente ConfirmDialog
 */
export interface ConfirmDialogProps {
    /** Si el diálogo está abierto */
    isOpen: boolean;
    /** Callback al cerrar el diálogo */
    onClose: () => void;
    /** Callback al confirmar la acción */
    onConfirm: () => void;
    /** Título del diálogo */
    title: string;
    /** Mensaje descriptivo */
    message: string;
    /** Texto del botón de confirmación */
    confirmText?: string;
    /** Texto del botón de cancelación */
    cancelText?: string;
    /** Variante del botón de confirmación */
    variant?: 'danger' | 'warning' | 'primary';
    /** Si está procesando la acción */
    loading?: boolean;
}

/**
 * Diálogo de confirmación genérico
 * 
 * Usado para confirmar acciones destructivas como eliminaciones.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleDelete}
 *   title="Eliminar Departamento"
 *   message="¿Estás seguro de que deseas eliminar este departamento?"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    loading = false
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b">
                    <div className={`
                        flex items-center justify-center w-12 h-12 rounded-full
                        ${variant === 'danger' ? 'bg-red-100' : ''}
                        ${variant === 'warning' ? 'bg-yellow-100' : ''}
                        ${variant === 'primary' ? 'bg-blue-100' : ''}
                    `}>
                        <IconAlertTriangle
                            className={`
                                ${variant === 'danger' ? 'text-red-600' : ''}
                                ${variant === 'warning' ? 'text-yellow-600' : ''}
                                ${variant === 'primary' ? 'text-blue-600' : ''}
                            `}
                            size={24}
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant={variant === 'danger' ? 'destructive' : 'default'}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
