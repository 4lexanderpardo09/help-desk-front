
import { Modal } from './Modal';
import { Button } from './Button';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    variant?: 'success' | 'error' | 'info';
    buttonText?: string;
}

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
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    )}
                    {variant === 'error' && (
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                            <span className="material-symbols-outlined">error</span>
                        </div>
                    )}
                    {variant === 'info' && (
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                            <span className="material-symbols-outlined">info</span>
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
