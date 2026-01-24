export interface Subcategory {
    id: number;
    nombre: string;
    descripcion?: string; // HTML template
    categoriaId: number;
    categoria?: { id: number; nombre: string };
    prioridadId?: number;
    estado: number;
}
