import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './Button';
import { userService } from '../../modules/users/services/user.service';
import { toast } from 'sonner';
import { useAuth } from '../../modules/auth/context/useAuth';

export interface SignatureData {
    signature: string;
    comment?: string;
}

interface UnifiedSignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: SignatureData) => void;

    // Configuración visual
    title?: string;
    description?: string;

    // Funcionalidad de comentario
    showCommentField?: boolean;
    commentRequired?: boolean;
    commentLabel?: string;
    commentPlaceholder?: string;

    // Carga de firma de perfil
    enableProfileSignature?: boolean;

    // Estado
    isLoading?: boolean;
}

export const UnifiedSignatureModal: React.FC<UnifiedSignatureModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Firmar Documento',
    description = 'Por favor firme en el recuadro a continuación.',
    showCommentField = false,
    commentRequired = false,
    commentLabel = 'Comentario (Opcional)',
    commentPlaceholder = 'Escriba un comentario...',
    enableProfileSignature = true,
    isLoading = false
}) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [comment, setComment] = useState('');
    const [isLoadingSignature, setIsLoadingSignature] = useState(false);
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleClear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const handleConfirm = () => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            return;
        }

        if (showCommentField && commentRequired && !comment.trim()) {
            toast.error('El comentario es obligatorio');
            return;
        }

        const dataUrl = sigCanvas.current.toDataURL('image/png');
        onConfirm({
            signature: dataUrl,
            comment: showCommentField ? comment : undefined
        });
    };

    const handleEnd = () => {
        if (sigCanvas.current) {
            setIsEmpty(sigCanvas.current.isEmpty());
        }
    };

    const handleLoadProfileSignature = async () => {
        if (!user?.id) {
            toast.error('No se pudo identificar al usuario');
            return;
        }

        setIsLoadingSignature(true);
        try {
            const signatureUrl = userService.getProfileSignatureUrl(user.id);

            // Fetch the image and load it into the canvas
            const response = await fetch(signatureUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Firma de perfil no encontrada');
            }

            const blob = await response.blob();
            const img = new Image();
            const objectUrl = URL.createObjectURL(blob);

            img.onload = () => {
                if (sigCanvas.current) {
                    const canvas = sigCanvas.current.getCanvas();
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // Clear canvas first
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // Draw the image scaled to fit
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        setIsEmpty(false);
                    }
                }
                URL.revokeObjectURL(objectUrl);
                toast.success('Firma de perfil cargada');
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                toast.error('Error al cargar la imagen de la firma');
            };

            img.src = objectUrl;
        } catch (error) {
            console.error('Error loading profile signature:', error);
            toast.error('No se encontró firma guardada en su perfil');
        } finally {
            setIsLoadingSignature(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={isLoading ? undefined : onClose}
                />

                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {description}
                                </p>

                                {/* Signature Pad */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-2">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor="black"
                                        canvasProps={{
                                            className: 'w-full h-48 rounded-lg cursor-crosshair',
                                        }}
                                        onEnd={handleEnd}
                                        backgroundColor="transparent"
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-gray-400">Dibuje su firma arriba *</span>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="text-xs text-brand-blue hover:underline"
                                            disabled={isLoading || isLoadingSignature}
                                        >
                                            Limpiar
                                        </button>

                                        {enableProfileSignature && (
                                            <button
                                                type="button"
                                                onClick={handleLoadProfileSignature}
                                                className="text-xs text-brand-teal hover:underline font-medium"
                                                disabled={isLoading || isLoadingSignature}
                                            >
                                                {isLoadingSignature ? 'Cargando...' : 'Usar mi firma guardada'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Field */}
                                {showCommentField && (
                                    <div className="mb-2">
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                            {commentLabel} {commentRequired && <span className="text-red-500">*</span>}
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={3}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border"
                                            placeholder={commentPlaceholder}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                        <Button
                            variant="brand"
                            onClick={handleConfirm}
                            disabled={isEmpty || isLoading || (showCommentField && commentRequired && !comment.trim())}
                        >
                            {isLoading ? 'Procesando...' : 'Confirmar Firma'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
