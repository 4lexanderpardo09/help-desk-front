export interface Zone {
    id: number;
    nombre: string;
    estado: number;
}

export interface CreateZoneDto {
    nombre: string;
    estado?: number;
}

export interface UpdateZoneDto {
    nombre?: string;
    estado?: number;
}

export interface ZoneFilter {
    search?: string;
    estado?: number | 'all';
    page?: number;
    limit?: number;
}

export interface ZoneListResponse {
    data: Zone[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
