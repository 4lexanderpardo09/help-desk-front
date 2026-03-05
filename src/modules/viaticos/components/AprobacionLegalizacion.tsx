import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/Button';
import { api } from '../../../core/api/api';

interface Gasto {
    gasto_id: number;
    concepto_id: number;
    fecha_gasto: string;
    ciudad: string;
    valor: number;
    nombre_proveedor: string;
    nit_proveedor: string;
    num_factura: string;
    archivo_path: string;
    observaciones: string;
    supera_tope: boolean;
    concepto: string;
    categoria: string;
}

interface ViaticoCompleto {
    solicitud_id: number;
    tick_id: number;
    formulario: {
        tipo_anticipo: string;
        valor_solicitado: number;
    };
    legalizacion: {
        gastos: Gasto[];
    };
    liquidacion: {
        total_gastos: number;
        total_retenciones: number;
        saldo_empresa: number;
        saldo_empleado: number;
    };
    anticipo: {
        anticipo_aprobado: number;
        valor_desembolsado: number;
    };
    aprobacion?: {
        aprobado_por_jefe: boolean | null;
        fecha_aprobacion_jefe: string | null;
        observaciones_jefe: string;
        aprobado_por_cac: boolean | null;
        fecha_aprobacion_cac: string | null;
        observaciones_cac: string;
    };
}

interface AprobacionLegalizacionProps {
    tickId: number;
    esJefe: boolean;
    onSuccess: () => void;
}

export function AprobacionLegalizacion({ tickId, esJefe, onSuccess }: AprobacionLegalizacionProps) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [observaciones, setObservaciones] = useState('');
    const [viatico, setViatico] = useState<ViaticoCompleto | null>(null);

    useEffect(() => {
        fetchViatico();
    }, [tickId]);

    const fetchViatico = async () => {
        setLoadingData(true);
        try {
            const response = await api.get<ViaticoCompleto>(`/viaticos/${tickId}`);
            setViatico(response.data);
        } catch (error) {
            console.error('Error fetching viatico:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const endpoint = esJefe 
        ? `/viaticos/${tickId}/aprobar-legalizacion-jefe`
        : `/viaticos/${tickId}/aprobar-legalizacion-cac`;

    // Verificar aprobación del usuario actual
    const miAprobacion = esJefe 
        ? viatico?.aprobacion?.aprobado_por_jefe
        : viatico?.aprobacion?.aprobado_por_cac;
    
    // Para CAC: puede aprobar aunque el jefe ya haya aprobado, pero solo una vez
    // Para Jefe: solo puede aprobar si no ha aprobado aún
    const puedoAprobar = miAprobacion === null || miAprobacion === undefined;

    // Estado de aprobaciones
    const aprobadoPorJefe = viatico?.aprobacion?.aprobado_por_jefe;

    const handleAprobar = async () => {
        setLoading(true);
        try {
            await api.patch(endpoint, { aprobado: true, observaciones });
            await fetchViatico();
            onSuccess();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRechazar = async () => {
        setLoading(true);
        try {
            await api.patch(endpoint, { aprobado: false, observaciones });
            await fetchViatico();
            onSuccess();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="bg-white rounded-lg shadow border border-yellow-200 p-6 mt-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!viatico) {
        return (
            <div className="bg-white rounded-lg shadow border border-yellow-200 p-6 mt-6">
                <p className="text-gray-500">No se encontró la solicitud de viático</p>
            </div>
        );
    }

    const totalGastos = viatico.legalizacion?.gastos?.reduce((sum, g) => sum + Number(g.valor), 0) || 0;
    const anticipoAprobado = viatico.anticipo?.anticipo_aprobado || 0;

    return (
        <div className="bg-white rounded-lg shadow border border-yellow-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Aprobación de Legalización
                    </h3>
                    <p className="text-sm text-gray-500">
                        {esJefe 
                            ? 'Eres el jefe responsable de aprobar esta legalización' 
                            : 'Eres el CAC responsable de aprobar esta legalización'}
                    </p>
                </div>
                {esJefe ? (
                    miAprobacion !== null && miAprobacion !== undefined ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${miAprobacion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {miAprobacion ? 'Aprobado' : 'Rechazado'}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            Pendiente de Aprobación
                        </span>
                    )
                ) : (
                    // Para CAC: mostrar estado del CAC o del jefe
                    <div className="flex gap-2">
                        {aprobadoPorJefe !== null && aprobadoPorJefe !== undefined && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${aprobadoPorJefe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Jefe: {aprobadoPorJefe ? '✓' : '✗'}
                            </span>
                        )}
                        {miAprobacion !== null && miAprobacion !== undefined ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${miAprobacion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {miAprobacion ? 'Aprobado' : 'Rechazado'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Pendiente de tu Aprobación
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Resumen de la Solicitud */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Resumen de la Solicitud</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{viatico.formulario?.tipo_anticipo === 'sin_anticipo' ? 'Sin Anticipo' : 'Con Anticipo'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Anticipo Aprobado:</span>
                        <p className="font-medium">${anticipoAprobado.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Total Gastos:</span>
                        <p className="font-medium text-teal-600">${totalGastos.toLocaleString('es-CO')}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Diferencia:</span>
                        <p className={`font-medium ${totalGastos > anticipoAprobado ? 'text-red-600' : 'text-green-600'}`}>
                            ${(totalGastos - anticipoAprobado).toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla de Gastos */}
            <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Gastos Reportados ({viatico.legalizacion?.gastos?.length || 0})</h4>
                {viatico.legalizacion?.gastos?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Fecha</th>
                                    <th className="px-3 py-2 text-left">Concepto</th>
                                    <th className="px-3 py-2 text-left">Ciudad</th>
                                    <th className="px-3 py-2 text-left">Proveedor</th>
                                    <th className="px-3 py-2 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {viatico.legalizacion.gastos.map((gasto) => (
                                    <tr key={gasto.gasto_id}>
                                        <td className="px-3 py-2">{new Date(gasto.fecha_gasto).toLocaleDateString('es-CO')}</td>
                                        <td className="px-3 py-2">{gasto.concepto || `Concepto #${gasto.concepto_id}`}</td>
                                        <td className="px-3 py-2">{gasto.ciudad || '-'}</td>
                                        <td className="px-3 py-2">{gasto.nombre_proveedor || '-'}</td>
                                        <td className="px-3 py-2 text-right font-medium">${Number(gasto.valor).toLocaleString('es-CO')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-medium">
                                <tr>
                                    <td colSpan={4} className="px-3 py-2 text-right">Total:</td>
                                    <td className="px-3 py-2 text-right">${totalGastos.toLocaleString('es-CO')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No hay gastos reportados</p>
                )}
            </div>

            {/* Observaciones */}
            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones (opcional)
                </label>
                <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Agregar comentarios sobre la legalización..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                />
            </div>

            {/* Botones */}
            {!puedoAprobar ? (
                <div className={`mt-4 p-4 rounded-lg ${miAprobacion ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                        {miAprobacion ? (
                            <>
                                <span className="text-green-600 text-2xl">✓</span>
                                <div>
                                    <p className="font-medium text-green-800">Legalización {esJefe ? 'Aprobada por ti' : 'Aprobada'}</p>
                                    <p className="text-sm text-green-600">Debes avanzar el ticket al siguiente paso</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-red-600 text-2xl">✗</span>
                                <div>
                                    <p className="font-medium text-red-800">Legalización Rechazada</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex gap-3 mt-4 justify-end">
                    <Button
                        variant="secondary"
                        onClick={handleRechazar}
                        disabled={loading}
                    >
                        Rechazar
                    </Button>
                    <Button
                        variant="brand"
                        onClick={handleAprobar}
                        disabled={loading}
                    >
                        Aprobar
                    </Button>
                </div>
            )}
        </div>
    );
}
