import { useState } from 'react';
import { usePermissions } from '../../../shared/hooks/usePermissions';
import { useLayout } from '../../../core/layout/context/LayoutContext';
import { Icon } from '../../../shared/components/Icon';
import { reportService } from '../services/report.service';

export default function ReportsPage() {
    const { can } = usePermissions();
    const { setTitle } = useLayout();
    const [exporting, setExporting] = useState(false);

    // Set page title
    useState(() => {
        setTitle('Reportes');
    });

    const handleExportPerformance = async () => {
        try {
            setExporting(true);
            await reportService.exportPerformance();
        } catch (error) {
            console.error('Error exporting performance report', error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Centro de descarga de informes y análisis del sistema.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Performance Report Card */}
                {can('read', 'Report') && (
                    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Desempeño</p>
                                <p className="mt-2 text-xl font-bold text-gray-800">Métricas y Tiempos</p>
                                <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                                    Genera un archivo Excel detallado con los tiempos de resolución y demoras por usuario o departamento.
                                </p>
                            </div>
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                                <Icon name="insert_chart" className="text-2xl" style={{ fontVariationSettings: '"FILL" 1' }} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleExportPerformance}
                                disabled={exporting}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:opacity-50"
                            >
                                {exporting ? (
                                    <>
                                        <Icon name="sync" className="h-5 w-5 animate-spin" />
                                        <span>Generando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="download" className="h-5 w-5" />
                                        <span>Descargar Excel</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Si no tiene permisos */}
            {!can('read', 'Report') && (
                <div className="rounded-md bg-blue-50 p-4 mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Icon name="info" className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">
                                No tienes permisos para visualizar o descargar los reportes disponibles.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
