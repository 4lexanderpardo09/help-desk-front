export interface Profile {
    id: number;
    nombre: string;
    estado: number;
    fechaCreacion?: string;
    fechaModificacion?: string;
    fechaEliminacion?: string;
}

export interface CreateProfileDto {
    nombre: string;
    estado?: number;
}

export interface UpdateProfileDto {
    nombre?: string;
    estado?: number;
}
