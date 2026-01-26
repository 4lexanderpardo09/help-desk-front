import React, { useState, useEffect } from 'react';
import type { CheckNextStepResponse, UserCandidate } from '../interfaces/Ticket';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';

interface WorkflowDecisionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transitionData: CheckNextStepResponse | null;
    onConfirm: (decisionKey: string, targetUserId?: number) => void;
    isLoading?: boolean;
}

export const WorkflowDecisionModal: React.FC<WorkflowDecisionModalProps> = ({
    open,
    onOpenChange,
    transitionData,
    onConfirm,
    isLoading
}) => {
    const [selectedDecision, setSelectedDecision] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [stepCandidates, setStepCandidates] = useState<UserCandidate[]>([]);

    // Derived state
    const isDecisionMode = transitionData?.transitionType === 'decision';
    const isLinearMode = transitionData?.transitionType === 'linear';

    useEffect(() => {
        if (open) {
            // Reset states when opening
            setSelectedDecision('');
            setSelectedUser('');

            if (isLinearMode && transitionData?.linear?.candidates) {
                setStepCandidates(transitionData.linear.candidates);
            }
        }
    }, [open, transitionData, isLinearMode]);

    const handleConfirm = () => {
        const transitionKey = isDecisionMode ? selectedDecision : (transitionData?.linear?.targetStepId.toString() || '');
        const userId = selectedUser ? Number(selectedUser) : undefined;
        onConfirm(transitionKey, userId);
    };

    const needsUserSelection = () => {
        if (isLinearMode) return transitionData?.linear?.requiresManualAssignment;
        // Logic for decision mode user selection would go here
        return false;
    };

    return (
        <Modal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            title="Confirmar Transición"
            className="sm:max-w-md"
        >
            <div className="space-y-6">
                <p className="text-sm text-gray-500">
                    {isDecisionMode
                        ? 'Seleccione la acción que desea tomar para este ticket.'
                        : 'Para avanzar, por favor complete la siguiente información.'}
                </p>

                <div className="space-y-4">
                    {/* DECISION MODE SELECTOR */}
                    {isDecisionMode && transitionData?.decisions && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#121617]">Decisión</label>
                            <div className="flex flex-col gap-2">
                                {transitionData.decisions.map((d) => (
                                    <button
                                        key={d.decisionId}
                                        onClick={() => setSelectedDecision(d.decisionId)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedDecision === d.decisionId
                                                ? 'border-brand-teal bg-teal-50 text-brand-teal shadow-sm'
                                                : 'border-gray-200 hover:bg-slate-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium">{d.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MANUAL ASSIGNMENT SELECTOR (Linear Mode) */}
                    {needsUserSelection() && (
                        <div className="space-y-2">
                            <label htmlFor="user-select" className="text-sm font-semibold text-[#121617]">Asignar a Usuario</label>
                            <div className="relative">
                                <select
                                    id="user-select"
                                    className="block w-full rounded-lg border border-gray-200 bg-slate-50 p-3 text-base text-[#121617] focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal h-12 appearance-none"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                >
                                    <option value="">Seleccione un usuario...</option>
                                    {stepCandidates.map((u) => (
                                        <option key={u.id} value={u.id.toString()}>
                                            {u.nombre} {u.apellido} {u.cargo ? `(${u.cargo})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    )}

                    {/* LINEAR INFO */}
                    {isLinearMode && !needsUserSelection() && (
                        <div className="p-4 bg-sky-50 text-sky-800 rounded-lg text-sm border border-sky-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
                            <div>
                                El ticket avanzará automáticamente al paso: <br />
                                <strong className="font-bold">{transitionData?.linear?.targetStepName}</strong>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="brand"
                        onClick={handleConfirm}
                        disabled={
                            isLoading ||
                            (isDecisionMode && !selectedDecision) ||
                            (needsUserSelection() && !selectedUser)
                        }
                    >
                        {isLoading ? 'Procesando...' : 'Confirmar y Avanzar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
