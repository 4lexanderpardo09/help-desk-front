import { useState, useCallback, useEffect } from 'react';
import { useLayout } from '../../../core/layout/context/LayoutContext';
import { Icon } from '../../../shared/components/Icon';
import { DataTable } from '../../../shared/components/DataTable';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { FilterBar, type FilterConfig } from '../../../shared/components/FilterBar';
import { errorTypeService } from '../services/error-type.service';
import type { ErrorType } from '../interfaces/ErrorType';
import { CreateErrorTypeModal } from '../components/CreateErrorTypeModal';
import { EditErrorTypeModal } from '../components/EditErrorTypeModal';

export default function ErrorTypesPage() {
    const { setTitle } = useLayout();
    const [data, setData] = useState<ErrorType[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | 'all'>('all');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ErrorType | null>(null);

    useEffect(() => {
        setTitle('Tipos de Error (Respuestas Rápidas)');
    }, [setTitle]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await errorTypeService.getErrorTypes({
                page,
                limit: 10,
                search,
                isActive: isActiveFilter
            });
            setData(response.data);
            setTotalPages(response.meta.totalPages);
            setTotalItems(response.meta.total);
        } catch (error) {
            console.error('Error loading error types:', error);
        } finally {
            setLoading(false);
        }
    }, [page, search, isActiveFilter]);

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [search, isActiveFilter]);

    // Debounced load
    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [loadData, search]);

    const handleDelete = async () => {
        if (selectedItem) {
            try {
                await errorTypeService.deleteErrorType(selectedItem.id);
                setShowDeleteDialog(false);
                loadData();
            } catch (error) {
                console.error('Error deleting error type:', error);
            }
        }
    };

    const getCategoryLabel = (cat: number) => {
        switch (cat) {
            case 1: return 'Error de Proceso';
            case 0: return 'Informativo';
            default: return 'General';
        }
    };

    const columns = [
        { key: 'id', header: 'ID', accessor: 'id' as keyof ErrorType },
        { key: 'title', header: 'Título', accessor: 'title' as keyof ErrorType },
        {
            key: 'category',
            header: 'Categoría',
            accessor: 'category' as keyof ErrorType,
            render: (row: ErrorType) => (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {getCategoryLabel(row.category)}
                </span>
            )
        },
        {
            key: 'subtypes',
            header: 'Subtipos',
            accessor: 'subtypes' as keyof ErrorType,
            render: (row: ErrorType) => (
                <span className="text-sm text-gray-500">
                    {row.subtypes?.length || 0}
                </span>
            )
        },
        {
            key: 'isActive',
            header: 'Estado',
            accessor: 'isActive' as keyof ErrorType,
            render: (row: ErrorType) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {row.isActive ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            accessor: 'id' as keyof ErrorType,
            render: (row: ErrorType) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => { setSelectedItem(row); setShowEditModal(true); }}
                        className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                        title="Editar"
                    >
                        <Icon name="edit" className="text-lg" />
                    </button>
                    <button
                        onClick={() => { setSelectedItem(row); setShowDeleteDialog(true); }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                    >
                        <Icon name="delete" className="text-lg" />
                    </button>
                </div>
            )
        }
    ];

    const filterConfig: FilterConfig[] = [
        {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar tipos de error...',
            value: search,
            onChange: (val) => setSearch(val as string)
        },
        {
            type: 'select',
            name: 'isActive',
            value: isActiveFilter === 'all' ? 'all' : isActiveFilter ? 'true' : 'false',
            onChange: (val) => setIsActiveFilter(val === 'all' ? 'all' : val === 'true'),
            options: [
                { label: 'Todos los Estados', value: 'all' },
                { label: 'Activos', value: 'true' },
                { label: 'Inactivos', value: 'false' }
            ]
        }
    ];

    return (
        <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tipos de Error</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona los tipos de error y sus subtipos para respuestas rápidas
                    </p>
                </div>
                <Button variant="brand" onClick={() => setShowCreateModal(true)}>
                    <Icon name="add" className="mr-2" />
                    Nuevo Tipo de Error
                </Button>
            </div>

            <FilterBar filters={filterConfig} className="mb-6" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total: totalItems,
                        limit: 10,
                        onPageChange: setPage
                    }}
                    getRowKey={(item) => item.id.toString()}
                />
            </div>

            <CreateErrorTypeModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={loadData}
            />

            <EditErrorTypeModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={loadData}
                errorType={selectedItem}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Eliminar Tipo de Error"
                message={`¿Estás seguro de que deseas eliminar "${selectedItem?.title}"?`}
                variant="danger"
            />
        </div>
    );
}
