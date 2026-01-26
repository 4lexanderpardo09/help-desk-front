import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from '../../../shared/components/Button';
import { useWorkflowTransition } from '../hooks/useWorkflowTransition';
import { WorkflowDecisionModal } from './WorkflowDecisionModal';
import { DynamicStepForm } from './DynamicStepForm';
import { ticketService } from '../services/ticket.service';
import type { TransitionTicketDto, TemplateField } from '../interfaces/Ticket';
import { toast } from 'sonner';
import { useAuth } from '../../auth/context/useAuth';

interface TicketResponsePanelProps {
    ticketId: number;
    assignedToId?: number;
    assignedToName?: string;
    creatorId: number; // Required for checking permissions
    creatorName: string;
    onSuccess: () => void;
    templateFields?: TemplateField[];
}

export const TicketResponsePanel: React.FC<TicketResponsePanelProps> = ({
    ticketId,
    assignedToId,
    assignedToName,
    creatorId,
    creatorName,
    onSuccess,
    templateFields = []
}) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [dynamicValues, setDynamicValues] = useState<{ campoId: number; valor: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Permission Logic
    const canInteract = Number(user?.id) === Number(assignedToId) || Number(user?.id) === Number(creatorId);

    // Hook logic
    const {
        data: transitionData,
        modalOpen,
        checkTransition,
        closeModal,
        isLoading: isChecking
    } = useWorkflowTransition(ticketId);

    // Handler for "Enviar" / "Avanzar" click
    const handleMainAction = async () => {
        const cleanComment = comment.replace(/<[^>]*>/g, '').trim();
        if (!cleanComment) {
            toast.warning('Por favor escriba un comentario o respuesta.');
            return;
        }
        await checkTransition();
    };

    // Handler when Modal confirms decision/user
    const handleTransitionConfirm = async (transitionKeyOrStepId: string, targetUserId?: number) => {
        setIsSubmitting(true);
        try {
            const dto: TransitionTicketDto = {
                ticketId,
                transitionKeyOrStepId,
                comentario: comment,
                targetUserId,
                templateValues: dynamicValues.length > 0 ? dynamicValues : undefined,
            };

            await ticketService.transitionTicket(dto);

            toast.success('Ticket actualizado correctamente');
            setComment('');
            setDynamicValues([]);
            closeModal();
            onSuccess();

        } catch (error) {
            console.error(error);
            toast.error('Error al procesar la transición');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canInteract) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <span className="material-symbols-outlined text-gray-500 text-2xl">lock</span>
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">Modo de Solo Lectura</h3>
                <p className="text-gray-500 text-sm max-w-md">
                    Solo el usuario asignado ({assignedToName || 'Sin asignar'}) o el creador ({creatorName}) pueden responder o avanzar el flujo en este momento.
                </p>
                <div className="mt-4 text-xs text-brand-teal font-medium bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    Tú eres: {user?.nombre} {user?.apellido}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Responder / Avanzar Flujo</h3>

            {/* DYNAMIC FORM AREA */}
            {templateFields.length > 0 && (
                <DynamicStepForm
                    fields={templateFields}
                    onChange={setDynamicValues}
                />
            )}

            {/* EDITOR AREA */}
            <div className="mb-4">
                <ReactQuill
                    theme="snow"
                    value={comment}
                    onChange={setComment}
                    placeholder="Escriba su respuesta o notas internas..."
                    className="bg-white"
                />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="brand"
                    onClick={handleMainAction}
                    disabled={isChecking || isSubmitting}
                >
                    {isChecking ? 'Verificando...' : 'Enviar y Avanzar'}
                </Button>
            </div>

            {/* MODAL */}
            <WorkflowDecisionModal
                open={modalOpen}
                onOpenChange={(v) => !v && closeModal()}
                transitionData={transitionData}
                onConfirm={handleTransitionConfirm}
                isLoading={isSubmitting}
            />
        </div>
    );
};
