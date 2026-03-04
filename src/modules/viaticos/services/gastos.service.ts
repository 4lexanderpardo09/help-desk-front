import { api } from '../../../core/api/api';
import { type ViaticoConcepto } from './viaticos.service';

export interface ViaticoGasto {
    id: number;
    solicitudId: number;
    conceptoId: number;
    fechaGasto: string;
    ciudad?: string;
    valor: number;
    nombreProveedor?: string;
    nitProveedor?: string;
    numFactura?: string;
    archivoPath?: string;
    observaciones?: string;
    superaTope: boolean;
    fechaCreacion: string;
    concepto?: ViaticoConcepto;
}

export interface CreateGastoDto {
    concepto_id: number;
    fecha_gasto: string;
    ciudad?: string;
    valor: number;
    nombre_proveedor?: string;
    nit_proveedor?: string;
    num_factura?: string;
    observaciones?: string;
}

export interface UpdateGastoDto {
    concepto_id?: number;
    fecha_gasto?: string;
    ciudad?: string;
    valor?: number;
    nombre_proveedor?: string;
    nit_proveedor?: string;
    num_factura?: string;
    observaciones?: string;
}

class GastosService {
    async getGastos(tickId: number): Promise<ViaticoGasto[]> {
        const response = await api.get<ViaticoGasto[]>(`/viaticos/${tickId}/gastos`);
        return response.data;
    }

    async getGasto(tickId: number, gastoId: number): Promise<ViaticoGasto> {
        const response = await api.get<ViaticoGasto>(`/viaticos/${tickId}/gastos/${gastoId}`);
        return response.data;
    }

    async createGasto(tickId: number, data: CreateGastoDto, archivo?: File): Promise<ViaticoGasto> {
        const formData = new FormData();
        
        formData.append('data', JSON.stringify(data));
        
        if (archivo) {
            formData.append('archivo', archivo);
        }

        const response = await api.post<ViaticoGasto>(`/viaticos/${tickId}/gastos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async updateGasto(tickId: number, gastoId: number, data: UpdateGastoDto, archivo?: File): Promise<ViaticoGasto> {
        const formData = new FormData();
        
        formData.append('data', JSON.stringify(data));
        
        if (archivo) {
            formData.append('archivo', archivo);
        }

        const response = await api.patch<ViaticoGasto>(`/viaticos/${tickId}/gastos/${gastoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async deleteGasto(tickId: number, gastoId: number): Promise<void> {
        await api.delete(`/viaticos/${tickId}/gastos/${gastoId}`);
    }
}

export const gastosService = new GastosService();
