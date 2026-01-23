import { useEffect, useState } from 'react';
import { FormModal } from '../../../shared/components/FormModal';
import { Input } from '../../../shared/components/Input';
import { zoneService } from '../../zones/services/zone.service';
import type { Regional, UpdateRegionalDto } from '../interfaces/Region';
import type { Zone } from '../../zones/interfaces/Zone';

interface EditRegionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, data: UpdateRegionalDto) => Promise<void>;
    region: Regional | null;
}

export function EditRegionModal({ isOpen, onClose, onSubmit, region }: EditRegionModalProps) {
    const [formData, setFormData] = useState<UpdateRegionalDto>({
        nombre: '',
        zonaId: undefined,
        estado: 1
    });
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadDependencies();
        }
    }, [isOpen]);

    useEffect(() => {
        if (region) {
            setFormData({
                nombre: region.nombre,
                zonaId: region.zonaId || undefined,
                estado: region.estado
            });
        }
    }, [region]);

    const loadDependencies = async () => {
        try {
            const z = await zoneService.getAll();
            setZones(z);
        } catch (err) {
            console.error('Error loading zones:', err);
            setError('Error al cargar zonas');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!region) return;

        setError(null);
        setLoading(true);

        try {
            await onSubmit(region.id, formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar regional');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title="Editar Regional"
            submitText="Guardar Cambios"
            loading={loading}
            size="md"
        >
            <div className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <Input
                    label="Nombre de la Regional"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    disabled={loading}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:bg-gray-50"
                        value={formData.zonaId || ''}
                        onChange={(e) => setFormData({ ...formData, zonaId: e.target.value ? Number(e.target.value) : undefined })}
                        disabled={loading}
                    >
                        <option value="">Seleccione una zona (opcional)</option>
                        {zones.map((z) => (
                            <option key={z.id} value={z.id}>
                                {z.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="edit_region_estado"
                        checked={formData.estado === 1}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.checked ? 1 : 0 })}
                        disabled={loading}
                        className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                    />
                    <label htmlFor="edit_region_estado" className="text-sm font-medium text-gray-700">
                        Activo
                    </label>
                </div>
            </div>
        </FormModal>
    );
}
