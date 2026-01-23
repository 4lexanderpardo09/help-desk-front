import { useState } from 'react';
import { FormModal } from '../../../shared/components/FormModal';
import { Input } from '../../../shared/components/Input';
import type { CreateZoneDto } from '../interfaces/Zone';

interface CreateZoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateZoneDto) => Promise<void>;
}

export function CreateZoneModal({ isOpen, onClose, onSubmit }: CreateZoneModalProps) {
    const [formData, setFormData] = useState<CreateZoneDto>({
        nombre: '',
        estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSubmit(formData);
            setFormData({ nombre: '', estado: 1 });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear zona');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nombre: '', estado: 1 });
        setError(null);
        onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title="Crear Zona"
            submitText="Crear"
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
                    label="Nombre de la Zona"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Zona Norte"
                    required
                    disabled={loading}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="create_zone_estado"
                        checked={formData.estado === 1}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.checked ? 1 : 0 })}
                        disabled={loading}
                        className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                    />
                    <label htmlFor="create_zone_estado" className="text-sm font-medium text-gray-700">
                        Activo
                    </label>
                </div>
            </div>
        </FormModal>
    );
}
