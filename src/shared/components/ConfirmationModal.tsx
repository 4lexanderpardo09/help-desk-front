

import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
    /** Controls visibility of the modal */
    isOpen: boolean;
    /** Callback when user cancels or closes the modal */
    onClose: () => void;
    /** Callback when user clicks the confirm button */
    onConfirm: () => void;
    /** Modal title */
    title: string;
    /** Modal body text */
    message: string;
    /** Text for the confirm button. Defaults to 'Confirmar' */
    confirmText?: string;
    /** Text for the cancel button. Defaults to 'Cancelar' */
    cancelText?: string;
    /** Visual style definition. 'destructive' uses red styling. */
    variant?: 'danger' | 'warning' | 'info';
    /** If true, disables buttons and shows loading state */
    loading?: boolean;
}

/**
 * A reusable modal component for confirming destructive or important actions.
 * Replaces native `confirm()` interaction.
 */
export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    loading = false
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-gray-600">
                    {message}
                </p>
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'destructive' : 'brand'}
                        onClick={onConfirm}
                        disabled={loading}
                        className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
