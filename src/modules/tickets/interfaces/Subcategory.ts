export interface Subcategory {
    id: number;
    nombre: string;
    descripcion?: string; // HTML template
    categoriaId: number;
    prioridadId?: number;
    estado: number;
}
