import { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { profileService } from '../services/profile.service';
import type { CreateProfileDto } from '../interfaces/Profile';

interface CreateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateProfileModal({ isOpen, onClose, onSuccess }: CreateProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const dto: CreateProfileDto = {
                nombre
            };
            await profileService.createProfile(dto);
            setNombre('');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error creating profile:', err);
            setError(err.response?.data?.message || 'Error al crear el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear Nuevo Perfil"
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <Input
                    label="Nombre del Perfil"
                    placeholder="Ej. Técnico Nivel 1, Administrador..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="brand"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Crear' : 'Crear Perfil'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
