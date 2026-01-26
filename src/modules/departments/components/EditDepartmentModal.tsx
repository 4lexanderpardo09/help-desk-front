import { useState, useEffect } from 'react';
import { FormModal } from '../../../shared/components/FormModal';
import { Input } from '../../../shared/components/Input';
import type { Department, UpdateDepartmentDto } from '../interfaces/Department';
import { departmentService } from '../../../shared/services/catalog.service';

export interface EditDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, data: UpdateDepartmentDto) => void | Promise<void>;
    department: Department | null;
}

export function EditDepartmentModal({
    isOpen,
    onClose,
    onSubmit,
    department
}: EditDepartmentModalProps) {
    const [formData, setFormData] = useState<UpdateDepartmentDto>({
        nombre: '',
        estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del departamento cuando se abre el modal
    useEffect(() => {
        if (department) {
            // Fetch fresh data
            departmentService.getDepartment(department.id)
                .then(dept => {
                    setFormData({
                        nombre: dept.nombre,
                        estado: dept.estado
                    });
                })
                .catch(err => {
                    console.error("Error loading department", err);
                    setFormData({
                        nombre: department.nombre,
                        estado: department.estado
                    });
                });
        }
    }, [department]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!department) return;

        setError(null);
        setLoading(true);

        try {
            await onSubmit(department.id, formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar departamento');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!department) return null;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title="Editar Departamento"
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
                    label="Nombre del Departamento"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Sistemas, Recursos Humanos"
                    required
                    disabled={loading}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="estado-edit"
                        checked={formData.estado === 1}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.checked ? 1 : 0 })}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="estado-edit" className="text-sm font-medium text-gray-700">
                        Activo
                    </label>
                </div>
            </div>
        </FormModal>
    );
}
