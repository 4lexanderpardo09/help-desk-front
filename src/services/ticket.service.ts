import { api } from './api';
import type { Ticket, TicketFilter, TicketListResponse, CreateTicketDto, TicketStatus, TicketPriority, TicketDetail, TicketTimelineItem } from '../interfaces/Ticket';

// Interface for the raw backend response (Spanish fields)
interface RawTicket {
    id: number;
    titulo: string;
    creadorNombre?: string;
    estado: string;
    prioridadUsuario?: string;
    prioridadDefecto?: string;
    fechaCreacion: string;

    // Detailed fields (might be optional in list view)
    descripcion?: string;
    categoria?: string | { nombre: string }; // Can be object or string based on previous debugging
    subcategoria?: string | { nombre: string };
    pasoActual?: string | { nombre: string };
    pasoActualId?: number;
    usuarioAsignado?: string;
    usuarioAsignadoId?: number;
}

interface RawTimelineItem {
    id?: number;
    actor?: { id: number; nombre: string };
    autor?: string;
    autorRol?: string;

    descripcion?: string;
    contenido?: string;

    type?: string;
    tipo?: string;

    fecha: string;
    metadata?: Record<string, unknown>;
}

export const ticketService = {
    async getTickets(filter: TicketFilter = {}): Promise<TicketListResponse> {
        // Map frontend filters to backend query params
        const params: Record<string, string | number> = {};

        if (filter.view) params.view = filter.view;
        if (filter.search) params.search = filter.search;

        if (filter.status && filter.status !== 'All Statuses') {
            params.status = filter.status;
        }

        if (filter.priority && filter.priority !== 'All Priorities') {
            params.priority = filter.priority;
        }

        params.page = filter.page || 1;
        params.limit = filter.limit || 10;

        // NOTE: This endpoint is defined in API.md as GET /tickets/list
        const response = await api.get<{ data: RawTicket[], meta: TicketListResponse['meta'] }>('/tickets/list', { params });

        // Adapter: Map Backend/Spanish response to Frontend/English interface
        const rawData = response.data.data || [];
        const mappedTickets: Ticket[] = rawData.map((t: RawTicket) => ({
            id: t.id,
            subject: t.titulo,
            customer: t.creadorNombre || 'Unknown',
            customerInitials: (t.creadorNombre || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase(),
            status: mapStatus(t.estado),
            priority: mapPriority(t.prioridadUsuario || t.prioridadDefecto || 'Media'),
            lastUpdated: new Date(t.fechaCreacion).toLocaleDateString() // Simple formatting
        }));

        return {
            data: mappedTickets,
            meta: response.data.meta || { total: mappedTickets.length, page: 1, limit: 10, totalPages: 1 }
        };
    },

    async createTicket(data: CreateTicketDto): Promise<Ticket> {
        const response = await api.post<RawTicket>('/tickets', data);
        const t = response.data;
        // Map single ticket response
        return {
            id: t.id,
            subject: t.titulo,
            customer: t.creadorNombre || 'Me', // When creating, it might not return creator name immediately
            customerInitials: 'ME',
            status: mapStatus(t.estado),
            priority: mapPriority(t.prioridadUsuario || 'Media'),
            lastUpdated: new Date().toLocaleDateString()
        };
    },

    async getTicket(id: number): Promise<TicketDetail> {
        const response = await api.get<RawTicket>(`/tickets/${id}`);
        const t = response.data;
        return {
            id: t.id,
            subject: t.titulo,
            customer: t.creadorNombre || 'Unknown',
            customerInitials: (t.creadorNombre || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase(),
            status: mapStatus(t.estado),
            priority: mapPriority(t.prioridadUsuario || t.prioridadDefecto || 'Media'),
            lastUpdated: new Date(t.fechaCreacion).toLocaleDateString(),

            // Detail specific
            description: t.descripcion || '',
            category: typeof t.categoria === 'object' && t.categoria !== null && 'nombre' in t.categoria
                ? t.categoria.nombre
                : (typeof t.categoria === 'string' ? t.categoria : 'General'),
            subcategory: typeof t.subcategoria === 'object' && t.subcategoria !== null && 'nombre' in t.subcategoria
                ? t.subcategoria.nombre
                : (typeof t.subcategoria === 'string' ? t.subcategoria : ''),
            createdDate: t.fechaCreacion,
            creatorName: t.creadorNombre || 'Unknown',
            workflowStep: typeof t.pasoActual === 'object' && t.pasoActual !== null && 'nombre' in t.pasoActual
                ? t.pasoActual.nombre
                : (typeof t.pasoActual === 'string' ? t.pasoActual : 'Review'),
            workflowStepId: t.pasoActualId || 0,
            assignedTo: t.usuarioAsignado,
            assignedToId: t.usuarioAsignadoId
        };
    },

    async getTicketTimeline(id: number): Promise<TicketTimelineItem[]> {
        const response = await api.get<RawTimelineItem[]>(`/tickets/${id}/timeline`);
        console.log('Raw Timeline Data:', response.data);
        return response.data.map((item, index) => {
            // Determine author name
            const authorName = item.actor?.nombre || item.autor || 'Unknown';

            // Determine content
            const content = item.descripcion || item.contenido || '';

            // Determine type
            const rawType = item.type || item.tipo || 'comment';

            return {
                id: item.id || index,
                type: mapTimelineType(rawType),
                content: content,
                author: authorName,
                authorRole: item.autorRol, // This might be missing in new response, check logic later
                authorAvatar: authorName.substring(0, 2).toUpperCase(),
                date: item.fecha,
                metadata: item.metadata
            };
        });
    }
};

// Helper mappers
function mapStatus(estado: string): TicketStatus {
    const map: Record<string, TicketStatus> = {
        'Abierto': 'Open',
        'En Proceso': 'In Progress',
        'Pausado': 'In Progress', // Mapping Pausado to In Progress for now
        'Resuelto': 'Resolved',
        'Cerrado': 'Closed'
    };
    return map[estado] || 'Open';
}

function mapPriority(prioridad: string): TicketPriority {
    const map: Record<string, TicketPriority> = {
        'Alta': 'High',
        'Media': 'Medium',
        'Baja': 'Low',
        'Critica': 'High'
    };
    return map[prioridad] || 'Medium';
}

function mapTimelineType(tipo: string): TicketTimelineItem['type'] {
    const normalize = tipo.toLowerCase();
    const map: Record<string, TicketTimelineItem['type']> = {
        'comentario': 'comment',
        'comment': 'comment',
        'asignacion': 'assignment',
        'assignment': 'assignment',
        'estado': 'status_change',
        'status_change': 'status_change',
        'sistema': 'field_update',
        'apertura': 'creation',
        'created': 'creation'
    };
    return map[normalize] || 'comment';
}
