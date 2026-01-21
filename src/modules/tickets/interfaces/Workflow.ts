export interface UserCandidate {
    id: number;
    nombre: string;
    apellido: string;
    cargo?: string;
    email?: string;
}

export interface CheckStartFlowResponse {
    requiresManualSelection: boolean;
    candidates: UserCandidate[];
    initialStepId: number;
    initialStepName: string;
}
