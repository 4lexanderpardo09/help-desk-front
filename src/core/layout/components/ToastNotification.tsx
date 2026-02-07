import { useNavigate } from 'react-router-dom';
import { IconX, IconBell, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import type { Toast } from '../../../shared/hooks/useToast';

interface ToastNotificationProps {
    toast: Toast;
    onClose: (id: string) => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (toast.ticketId) {
            navigate(`/tickets/${toast.ticketId}`);
            onClose(toast.id);
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <IconCircleCheck className="w-5 h-5 text-green-500" />;
            case 'error':
                return <IconAlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <IconAlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <IconBell className="w-5 h-5 text-brand-blue" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-white border-gray-200';
        }
    };

    return (
        <div
            className={`
                flex items-start gap-3 p-4 rounded-lg border shadow-lg
                ${getBackgroundColor()}
                ${toast.ticketId ? 'cursor-pointer hover:shadow-xl' : ''}
                transition-all duration-300 animate-slide-in-right
                max-w-sm w-full
            `}
            onClick={handleClick}
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium break-words">
                    {toast.message}
                </p>
                {toast.ticketId && (
                    <p className="text-xs text-gray-500 mt-1">
                        Click para ver el ticket
                    </p>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(toast.id);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar notificación"
            >
                <IconX className="w-4 h-4" />
            </button>
        </div>
    );
}
