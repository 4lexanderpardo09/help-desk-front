import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { api } from '../../../core/api/api';

interface ReopenTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: number;
    onSuccess: () => void;
}

interface ReopenFormBy {
    razon: string;
}

const ReopenTicketModal = ({ isOpen, onClose, ticketId, onSuccess }: ReopenTicketModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ReopenFormBy>();

    const onSubmit = async (data: ReopenFormBy) => {
        try {
            await api.post(`/tickets/${ticketId}/reopen`, {
                razon: data.razon,
                reportarError: true // Default to true
            });
            toast.success('Ticket reabierto exitosamente');
            reset();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error reopening ticket:', error);
            const msg = error.response?.data?.message || 'Error al reabrir el ticket';
            toast.error(msg);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Reabrir Ticket #${ticketId}`}
            className="max-w-md"
        >
            <div className="flex items-start gap-4 mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">Confirmación de Reapertura</h4>
                    <p className="text-sm text-yellow-700">
                        Estás a punto de reabrir este ticket. Esto cambiará su estado a "Abierto" y notificará a los usuarios involucrados.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo de la reapertura <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                        placeholder="Explica por qué se debe reabrir este ticket..."
                        {...register('razon', { required: 'La razón es obligatoria' })}
                    />
                    {errors.razon && <p className="mt-1 text-xs text-red-500">{errors.razon.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="brand" // Using 'brand' or generic styling if needed. The original had specific yellow styling.
                        className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar Reapertura'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ReopenTicketModal;
