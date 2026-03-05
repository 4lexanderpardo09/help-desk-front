import { useEffect, useState, useCallback } from 'react';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Icon } from '../../../shared/components/Icon';
import { gastosService, type ViaticoGasto, type CreateGastoDto, type UpdateGastoDto } from '../services/gastos.service';
import { viaticosService, type ViaticoConcepto } from '../services/viaticos.service';
import { GastoModal } from './GastoModal';

interface Props {
    tickId: number;
    isCreator: boolean;
}

export function LegalizacionGastos({ tickId, isCreator }: Props) {
    const [gastos, setGastos] = useState<ViaticoGasto[]>([]);
    const [conceptos, setConceptos] = useState<ViaticoConcepto[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedGasto, setSelectedGasto] = useState<ViaticoGasto | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [gastosData, conceptosData] = await Promise.all([
                gastosService.getGastos(tickId),
                viaticosService.getConceptos(),
            ]);
            setGastos(gastosData);
            setConceptos(conceptosData.filter(c => c.estado === 1));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [tickId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const totalGastos = gastos.reduce((sum, g) => sum + Number(g.valor), 0);

    const handleCreate = async (data: CreateGastoDto | UpdateGastoDto, archivo?: File) => {
        setLoading(true);
        try {
            await gastosService.createGasto(tickId, data as CreateGastoDto, archivo);
            await loadData();
        } catch (error) {
            console.error('Error creating gasto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (data: CreateGastoDto | UpdateGastoDto, archivo?: File) => {
        if (!selectedGasto) return;
        setLoading(true);
        try {
            await gastosService.updateGasto(tickId, selectedGasto.id, data as UpdateGastoDto, archivo);
            await loadData();
        } catch (error) {
            console.error('Error updating gasto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedGasto) return;
        setLoading(true);
        try {
            await gastosService.deleteGasto(tickId, selectedGasto.id);
            await loadData();
        } catch (error) {
            console.error('Error deleting gasto:', error);
        } finally {
            setLoading(false);
            setShowDeleteDialog(false);
            setSelectedGasto(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gastos de Legalización</h3>
                    <p className="text-sm text-gray-500">
                        Registra los gastos realizados en el viaje
                    </p>
                </div>
                {isCreator && (
                    <Button variant="brand" onClick={() => setShowModal(true)}>
                        <Icon name="add" className="mr-2" />
                        Agregar Gasto
                    </Button>
                )}
            </div>

            {loading && gastos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : gastos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay gastos registrados
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    {isCreator && <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {gastos.map((gasto) => (
                                    <tr key={gasto.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {new Date(gasto.fechaGasto).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {gasto.concepto?.nombre || `Concepto #${gasto.conceptoId}`}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {gasto.ciudad || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {gasto.nombreProveedor || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {gasto.numFactura || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                            ${Number(gasto.valor).toLocaleString('es-CO')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {gasto.superaTope ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Supera límite
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                        {isCreator && (
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedGasto(gasto);
                                                            setShowModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-brand-teal transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Icon name="edit" className="text-[18px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedGasto(gasto);
                                                            setShowDeleteDialog(true);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Icon name="delete" className="text-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-semibold">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-right text-sm text-gray-900">
                                        Total Gastos:
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                                        ${totalGastos.toLocaleString('es-CO')}
                                    </td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </>
            )}

            <GastoModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedGasto(null);
                }}
                onSubmit={selectedGasto ? handleEdit : handleCreate}
                gasto={selectedGasto}
                conceptos={conceptos}
                loading={loading}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setSelectedGasto(null);
                }}
                onConfirm={handleDelete}
                title="Eliminar Gasto"
                message={`¿Estás seguro de eliminar este gasto por $${Number(selectedGasto?.valor || 0).toLocaleString('es-CO')}?`}
                variant="danger"
                confirmText="Eliminar"
            />
        </div>
    );
}
