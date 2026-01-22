import type { ReactNode } from 'react';
import { IconX } from '@tabler/icons-react';
import { Button } from './Button';

/**
 * Props para el componente FormModal
 */
export interface FormModalProps {
    /** Si el modal está abierto */
    isOpen: boolean;
    /** Callback al cerrar el modal */
    onClose: () => void;
    /** Título del modal */
    title: string;
    /** Contenido del formulario */
    children: ReactNode;
    /** Callback al enviar el formulario */
    onSubmit: (e: React.FormEvent) => void;
    /** Texto del botón de envío */
    submitText?: string;
    /** Texto del botón de cancelación */
    cancelText?: string;
    /** Si está procesando el envío */
    loading?: boolean;
    /** Tamaño del modal */
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal genérico para formularios
 * 
 * Proporciona una estructura consistente para modales de creación/edición.
 * 
 * @example
 * ```tsx
 * <FormModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={handleSubmit}
 *   title="Crear Departamento"
 *   submitText="Crear"
 * >
 *   <Input label="Nombre" {...} />
 * </FormModal>
 * ```
 */
export function FormModal({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    loading = false,
    size = 'md'
}: FormModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <IconX size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Body */}
                    <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : submitText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
