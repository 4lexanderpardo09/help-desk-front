import { useState, useCallback, useEffect } from 'react';
import { useLayout } from '../../../core/layout/context/LayoutContext';
import { profileService } from '../services/profile.service';
import type { Profile } from '../interfaces/Profile';
import { Button } from '../../../shared/components/Button';
import { DataTable } from '../../../shared/components/DataTable';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { FilterBar, type FilterConfig } from '../../../shared/components/FilterBar';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { EditProfileModal } from '../components/EditProfileModal';

export default function ProfilesPage() {
    const { setTitle } = useLayout();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [estadoFilter, setEstadoFilter] = useState<number | 'all'>('all');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Data
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Profile | null>(null);

    useEffect(() => {
        setTitle('Gestión de Perfiles');
    }, [setTitle]);

    const loadProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await profileService.getProfiles({
                search: searchQuery,
                estado: estadoFilter,
                page,
                limit
            });
            setProfiles(response.data);
            setTotal(response.meta.total);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error('Error loading profiles:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, estadoFilter, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, estadoFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProfiles();
        }, searchQuery ? 300 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, loadProfiles]);

    const handleEdit = (profile: Profile) => {
        setSelectedItem(profile);
        setShowEditModal(true);
    };

    const handleDeleteClick = (profile: Profile) => {
        setProfileToDelete(profile);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (profileToDelete) {
            setLoading(true);
            try {
                await profileService.deleteProfile(profileToDelete.id);
                await loadProfiles();
                setShowDeleteDialog(false);
                setProfileToDelete(null);
            } catch (error) {
                console.error('Error deleting profile:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const columns = [
        {
            key: 'id',
            header: 'ID',
            render: (prof: Profile) => `#${prof.id}`
        },
        {
            key: 'nombre',
            header: 'Nombre',
            render: (prof: Profile) => <div className="font-medium text-gray-900">{prof.nombre}</div>
        },
        {
            key: 'estado',
            header: 'Estado',
            render: (prof: Profile) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prof.estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {prof.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (prof: Profile) => (
                <div className="flex gap-3">
                    <button onClick={() => handleEdit(prof)} className="text-gray-400 hover:text-brand-blue" title="Editar">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => handleDeleteClick(prof)} className="text-gray-400 hover:text-red-600" title="Eliminar">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    const filterConfig: FilterConfig[] = [
        {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar perfiles...',
            value: searchQuery,
            onChange: (val) => setSearchQuery(val as string)
        },
        {
            type: 'select',
            name: 'estado',
            value: estadoFilter,
            onChange: (val) => setEstadoFilter(val as number | 'all'),
            options: [
                { label: 'Todos los Estados', value: 'all' },
                { label: 'Activos', value: 1 },
                { label: 'Inactivos', value: 0 }
            ]
        }
    ];

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Perfiles</h2>
                    <p className="mt-1 text-sm text-gray-500">Gestiona los perfiles de usuario del sistema</p>
                </div>
                <Button variant="brand" onClick={() => setShowCreateModal(true)}>
                    <span className="material-symbols-outlined mr-2">add</span>
                    Crear Perfil
                </Button>
            </div>

            <CreateProfileModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={loadProfiles}
            />

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedItem(null); }}
                onSuccess={loadProfiles}
                profile={selectedItem}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => { setShowDeleteDialog(false); setProfileToDelete(null); }}
                onConfirm={confirmDelete}
                title="Eliminar Perfil"
                message={`¿Estás seguro de que deseas eliminar el perfil "${profileToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                variant="danger"
                confirmText="Eliminar"
            />

            <FilterBar filters={filterConfig} className="mb-6" />

            <DataTable
                data={profiles}
                columns={columns}
                getRowKey={(prof) => prof.id}
                loading={loading}
                emptyMessage="No se encontraron perfiles"
                loadingMessage="Cargando perfiles..."
                pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
            />
        </>
    );
}
