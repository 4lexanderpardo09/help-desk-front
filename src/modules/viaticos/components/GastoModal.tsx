import { useState, useEffect } from 'react';
import { FormModal } from '../../../shared/components/FormModal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { type ViaticoConcepto } from '../services/viaticos.service';
import { type CreateGastoDto, type UpdateGastoDto, type ViaticoGasto } from '../services/gastos.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateGastoDto | UpdateGastoDto, archivo?: File) => Promise<void>;
    gasto: ViaticoGasto | null;
    conceptos: ViaticoConcepto[];
    loading: boolean;
}

export function GastoModal({ isOpen, onClose, onSubmit, gasto, conceptos, loading }: Props) {
    const [formData, setFormData] = useState<CreateGastoDto>({
        concepto_id: 0,
        fecha_gasto: new Date().toISOString().split('T')[0],
        ciudad: '',
        valor: 0,
        nombre_proveedor: '',
        nit_proveedor: '',
        num_factura: '',
        observaciones: '',
    });
    const [archivo, setArchivo] = useState<File | undefined>();
    const [archivoName, setArchivoName] = useState<string>('');

    useEffect(() => {
        if (gasto) {
            setFormData({
                concepto_id: gasto.conceptoId,
                fecha_gasto: new Date(gasto.fechaGasto).toISOString().split('T')[0],
                ciudad: gasto.ciudad || '',
                valor: gasto.valor,
                nombre_proveedor: gasto.nombreProveedor || '',
                nit_proveedor: gasto.nitProveedor || '',
                num_factura: gasto.numFactura || '',
                observaciones: gasto.observaciones || '',
            });
            setArchivoName(gasto.archivoPath || '');
        } else {
            setFormData({
                concepto_id: 0,
                fecha_gasto: new Date().toISOString().split('T')[0],
                ciudad: '',
                valor: 0,
                nombre_proveedor: '',
                nit_proveedor: '',
                num_factura: '',
                observaciones: '',
            });
            setArchivoName('');
        }
        setArchivo(undefined);
    }, [gasto, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.concepto_id === 0) {
            alert('Por favor selecciona un concepto');
            return;
        }
        await onSubmit(formData, archivo);
        onClose();
    };

    const handleClose = () => {
        setArchivo(undefined);
        onClose();
    };

    const conceptoOptions = conceptos.map(c => ({
        value: c.id,
        label: `${c.nombre} ${c.topeDiario > 0 ? `(Tope: $${c.topeDiario.toLocaleString('es-CO')})` : ''}`,
    }));

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title={gasto ? 'Editar Gasto' : 'Agregar Gasto'}
            submitText={gasto ? 'Guardar' : 'Agregar'}
            loading={loading}
            size="lg"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Concepto *
                        </label>
                        <Select
                            value={formData.concepto_id}
                            onChange={(value) => setFormData({ 
                                ...formData, 
                                concepto_id: Number(value) 
                            })}
                            options={conceptoOptions}
                            placeholder="Seleccionar concepto"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha del Gasto *
                        </label>
                        <Input
                            type="date"
                            value={formData.fecha_gasto}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                fecha_gasto: e.target.value 
                            })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                        </label>
                        <Input
                            value={formData.ciudad}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                ciudad: e.target.value 
                            })}
                            placeholder="Ciudad donde se realizó el gasto"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor *
                        </label>
                        <Input
                            type="number"
                            value={formData.valor}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                valor: parseFloat(e.target.value) || 0 
                            })}
                            placeholder="0"
                            min={0}
                            required
                        />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Datos del Proveedor (Opcional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Proveedor
                            </label>
                            <Input
                                value={formData.nombre_proveedor}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    nombre_proveedor: e.target.value 
                                })}
                                placeholder="Razón social"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                NIT / Identificación
                            </label>
                            <Input
                                value={formData.nit_proveedor}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    nit_proveedor: e.target.value 
                                })}
                                placeholder="NIT o identificación"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Factura
                        </label>
                        <Input
                            value={formData.num_factura}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                num_factura: e.target.value 
                            })}
                            placeholder="Número de factura"
                        />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                    </label>
                    <textarea
                        value={formData.observaciones}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            observaciones: e.target.value 
                        })}
                        placeholder="Notas adicionales sobre el gasto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Archivo (Factura/Recibo)
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setArchivo(file);
                                setArchivoName(file.name);
                            }
                        }}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-teal-50 file:text-teal-700
                            hover:file:bg-teal-100"
                    />
                    {archivoName && !archivo && (
                        <p className="mt-1 text-sm text-gray-500">Archivo actual: {archivoName}</p>
                    )}
                    {archivo && (
                        <p className="mt-1 text-sm text-green-600">Nuevo archivo: {archivo.name}</p>
                    )}
                </div>
            </div>
        </FormModal>
    );
}
