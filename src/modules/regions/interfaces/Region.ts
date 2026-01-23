import type { Zone } from '../../zones/interfaces/Zone';

export interface Regional {
    id: number;
    nombre: string;
    estado: number;
    zonaId: number | null;

    // Relations
    zona?: Zone;
}

export interface CreateRegionalDto {
    nombre: string;
    zonaId?: number;
    estado?: number;
}

export interface UpdateRegionalDto {
    nombre?: string;
    zonaId?: number;
    estado?: number;
}

export interface RegionalFilter {
    search?: string;
    estado?: number | 'all';
    zonaId?: number | 'all';
    page?: number;
    limit?: number;
}

export interface RegionalListResponse {
    data: Regional[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
