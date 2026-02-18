
import { Modal } from './Modal';
import { Button } from './Button';
import { Icon } from './Icon';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    /** 
     * Determines the icon and color scheme.
     * success: Green + Check icon
     * error: Red + Error icon
     * info: Blue + Info icon
     */
    variant?: 'success' | 'error' | 'info';
    buttonText?: string;
}

/**
 * A reusable modal for displaying status messages (Success, Error, Info).
 * Replaces native `alert()` interactions.
 */
export function InfoModal({
    isOpen,
    onClose,
    title,
    message,
    variant = 'info',
    buttonText = 'Entendido'
}: InfoModalProps) {
    const isError = variant === 'error';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    {variant === 'success' && (
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                            <Icon name="check_circle" />
                        </div>
                    )}
                    {variant === 'error' && (
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                            <Icon name="error" />
                        </div>
                    )}
                    {variant === 'info' && (
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                            <Icon name="info" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-500 mt-2">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        variant={isError ? 'destructive' : 'brand'}
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
