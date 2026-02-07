import { ToastNotification } from './ToastNotification';
import type { Toast } from '../../../shared/hooks/useToast';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

/**
 * Container for toast notifications.
 * Displays toasts in the bottom-right corner of the screen.
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastNotification toast={toast} onClose={onRemove} />
                </div>
            ))}
        </div>
    );
}
