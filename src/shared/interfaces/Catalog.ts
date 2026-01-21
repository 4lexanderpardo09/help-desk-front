export interface CatalogItem {
    id: number;
    nombre: string;
    estado?: number;
    descripcion?: string;
}

export type Department = CatalogItem;
export type Position = CatalogItem;
export interface Region extends CatalogItem {
    zonaId?: number;
}
