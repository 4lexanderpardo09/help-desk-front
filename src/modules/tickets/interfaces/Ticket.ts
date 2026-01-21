export type TicketStatus = 'Abierto' | 'Pausado' | 'Cerrado';
export type TicketPriority = 'Alta' | 'Media' | 'Baja';

export interface Ticket {
    id: number;
    subject: string; // Asunto
    customer: string; // Nombre del cliente (calculado o relación)
    customerInitials: string; // Iniciales para el avatar
    status: TicketStatus;
    priority: TicketPriority;
    lastUpdated: string; // Fecha relativa o absoluta formataeda
}

export interface TicketFilter {
    view?: 'all' | 'created' | 'assigned' | 'observed';
    search?: string;
    status?: TicketStatus | 'All Statuses';
    priority?: TicketPriority | 'All Priorities';
    page?: number;
    limit?: number;
}

export interface TicketListResponse {
    data: Ticket[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateTicketDto {
    usuarioId?: number;
    titulo: string;
    descripcion: string;
    categoriaId: number;
    subcategoriaId: number;
    prioridadId?: number;
    usuarioAsignadoId?: number;
}

export interface UpdateTicketDto {
    titulo?: string;
    descripcion?: string;
    categoriaId?: number;
    prioridadId?: number;
    subcategoriaId?: number;
}

export interface TicketDetail extends Ticket {
    description: string;
    category: string;
    categoryId?: number; // Add ID for editing
    subcategory: string;
    subcategoryId?: number; // Add ID for editing
    createdDate: string; // ISO string
    creatorName: string;
    workflowStep: string;
    workflowStepId: number;
    assignedTo?: string;
    assignedToId?: number;
    priorityId?: number; // Add ID for editing
}

export interface TicketTimelineItem {
    id: number;
    type: 'comment' | 'status_change' | 'assignment' | 'field_update' | 'creation';
    content: string; // The comment or description of the event
    author: string;
    authorRole?: string;
    authorAvatar?: string; // URL or initials
    date: string; // ISO string
    metadata?: {
        oldStatus?: string;
        newStatus?: string;
        oldValue?: string;
        newValue?: string;
        fileUrl?: string;
        fileName?: string;
        attachments?: { id: number; nombre: string; url: string }[];
    };
}
