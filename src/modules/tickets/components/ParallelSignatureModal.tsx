import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../../../shared/components/Button';

interface ParallelSignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signatureBase64: string, comment: string) => void;
    isLoading?: boolean;
}

export const ParallelSignatureModal: React.FC<ParallelSignatureModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false
}) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleClear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const handleConfirm = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const dataUrl = sigCanvas.current.toDataURL('image/png');
            onConfirm(dataUrl, comment);
        }
    };

    const handleEnd = () => {
        if (sigCanvas.current) {
            setIsEmpty(sigCanvas.current.isEmpty());
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={isLoading ? undefined : onClose} />

                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                                    Firmar mi parte
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Por favor firme en el recuadro y agregue un comentario si es necesario para completar su tarea asignada.
                                </p>

                                {/* Signature Pad */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
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
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="text-xs text-brand-blue hover:underline"
                                        disabled={isLoading}
                                    >
                                        Limpiar firma
                                    </button>
                                </div>

                                {/* Comment Field */}
                                <div className="mb-2">
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                        Comentario (Opcional)
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows={3}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border"
                                        placeholder="Escriba su comentario aquí..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                        <Button
                            variant="brand"
                            onClick={handleConfirm}
                            disabled={isEmpty || isLoading}
                        >
                            {isLoading ? 'Procesando...' : 'Firmar y Confirmar'}
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
