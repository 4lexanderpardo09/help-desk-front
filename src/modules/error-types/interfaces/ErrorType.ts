export interface ErrorSubtype {
    id: number;
    errorTypeId: number;
    title: string;
    description: string;
    isActive: boolean;
}

export interface ErrorType {
    id: number;
    title: string;
    description: string;
    category: number; // 0=Info, 1=Process Error
    isActive: boolean;
    subtypes?: ErrorSubtype[];
}

// DTOs for Error Type (Parent)
export interface CreateErrorTypeDto {
    title: string;
    description: string;
    category: number;
    isActive?: boolean;
}

export interface UpdateErrorTypeDto {
    title?: string;
    description?: string;
    category?: number;
    isActive?: boolean;
}

// DTOs for Subtypes (Child)
export interface CreateErrorSubtypeDto {
    errorTypeId: number;
    title: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateErrorSubtypeDto {
    title?: string;
    description?: string;
    isActive?: boolean;
}

export interface ErrorTypeFilter {
    search?: string;
    isActive?: boolean | 'all';
    page?: number;
    limit?: number;
}

export interface ErrorTypeListResponse {
    data: ErrorType[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
