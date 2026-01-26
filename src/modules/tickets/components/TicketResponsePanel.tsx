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

interface TicketResponsePanelProps {
    ticketId: number;
    currentStepId: number;
    onSuccess: () => void;
    // In a real app, we would fetch fields from backend based on step. 
    // For now, accepting them as prop or defaulting to empty.
    templateFields?: TemplateField[];
}

export const TicketResponsePanel: React.FC<TicketResponsePanelProps> = ({
    ticketId,
    currentStepId,
    onSuccess,
    templateFields = []
}) => {
    const [comment, setComment] = useState('');
    const [dynamicValues, setDynamicValues] = useState<{ campoId: number; valor: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        // 1. Basic Validation
        const cleanComment = comment.replace(/<[^>]*>/g, '').trim();
        if (!cleanComment) {
            toast.warning('Por favor escriba un comentario o respuesta.');
            return;
        }

        // 2. Dynamic Form Validation (Basic)
        // If we had the schema here, we could check required fields again.
        // The DynamicStepForm handles individual validations but we need to ensure blocking.
        // For MVP, we assume ReactHookForm in child would have blocked if we exposed "isValid".
        // Let's assume validation passes if values are present for required fields.

        // 3. Check Backend Transition Requirements
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
                // attachmentIds: ... (Implement upload later)
            };

            await ticketService.transitionTicket(dto);

            toast.success('Ticket actualizado correctamente');
            setComment('');
            setDynamicValues([]);
            closeModal();
            onSuccess(); // Refresh parent

        } catch (error) {
            console.error(error);
            toast.error('Error al procesar la transición');
        } finally {
            setIsSubmitting(false);
        }
    };

    // If check returned "linear" without manual assignment, we might want to auto-confirm?
    // The Modal handles "Linear + No Manual" by just showing "Confirm".
    // Or we could auto-submit here if strictly automatic.
    // For safety, currently the Modal opens even for Linear to show "Avanzará a X".

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
                onOpenChange={(v) => !v && closeModal()} // Handle close
                transitionData={transitionData}
                onConfirm={handleTransitionConfirm}
                isLoading={isSubmitting}
            />
        </div>
    );
};
