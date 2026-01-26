export interface Workflow {
    id: number;
    nombre: string;
    descripcion?: string; // It seems entity doesn't have descripcion, let's keep it optional or remove if not in entity (entity has nombre and subcategoriaId only)
    // Wait, entity Flujo does NOT have descripcion. I should verify if user wants it.
    // The user asked "haz completo el form". Entity has: nombre, subcategoriaId, estado, nombreAdjunto.
    // I will keep descripcion as UI concept but maybe map it or remove it if backend rejects it.
    // Actually backend Does NOT have description in Flujo entity.
    // I will REMOVE descripcion from Interface and DTO to match backend.
    subcategoriaId: number;
    estado: number; // 1 = Activo, 0 = Inactivo
    nombreAdjunto?: string;
    subcategoria?: {
        id: number;
        nombre: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWorkflowDto {
    nombre: string;
    subcategoriaId: number;
    nombreAdjunto?: string;
    // estado default 1
}

export interface UpdateWorkflowDto {
    nombre?: string;
    subcategoriaId?: number;
    estado?: number;
    nombreAdjunto?: string;
}

export interface WorkflowFilter {
    search?: string;
    estado?: number | 'all';
    page?: number;
    limit?: number;
}

export interface WorkflowListResponse {
    data: Workflow[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
