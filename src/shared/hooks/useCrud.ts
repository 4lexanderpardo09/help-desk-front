import { useState, useCallback } from 'react';

/**
 * Estado de un item en el CRUD
 */
export interface CrudItem {
    id: number;
    [key: string]: unknown;
}

/**
 * Opciones de configuración para useCrud
 */
export interface UseCrudOptions<T extends CrudItem> {
    /** Función para obtener todos los items */
    fetchAll: () => Promise<T[]>;
    /** Función para crear un item */
    create: (data: unknown) => Promise<T>;
    /** Función para actualizar un item */
    update: (id: number, data: unknown) => Promise<T>;
    /** Función para eliminar un item */
    delete: (id: number) => Promise<void>;
    /** Callback al completar una acción exitosamente */
    onSuccess?: (action: 'create' | 'update' | 'delete') => void;
    /** Callback al ocurrir un error */
    onError?: (error: Error) => void;
}

/**
 * Hook genérico para manejar operaciones CRUD
 * 
 * Proporciona estado y funciones comunes para operaciones CRUD,
 * reduciendo código repetitivo en componentes.
 * 
 * @example
 * ```tsx
 * const {
 *   items,
 *   loading,
 *   selectedItem,
 *   handleCreate,
 *   handleUpdate,
 *   handleDelete,
 *   setSelectedItem
 * } = useCrud({
 *   fetchAll: departmentService.getAll,
 *   create: departmentService.create,
 *   update: departmentService.update,
 *   delete: departmentService.delete
 * });
 * ```
 */
export function useCrud<T extends CrudItem>({
    fetchAll,
    create,
    update,
    delete: deleteItem,
    onSuccess,
    onError
}: UseCrudOptions<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    /**
     * Carga todos los items
     */
    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAll();
            setItems(data);
        } catch (error) {
            onError?.(error as Error);
        } finally {
            setLoading(false);
        }
    }, [fetchAll, onError]);

    /**
     * Crea un nuevo item
     */
    const handleCreate = useCallback(async (data: unknown) => {
        setLoading(true);
        try {
            const newItem = await create(data);
            setItems(prev => [...prev, newItem]);
            onSuccess?.('create');
            return newItem;
        } catch (error) {
            onError?.(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [create, onSuccess, onError]);

    /**
     * Actualiza un item existente
     */
    const handleUpdate = useCallback(async (id: number, data: unknown) => {
        setLoading(true);
        try {
            const updatedItem = await update(id, data);
            setItems(prev => prev.map(item =>
                item.id === id ? updatedItem : item
            ));
            onSuccess?.('update');
            return updatedItem;
        } catch (error) {
            onError?.(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [update, onSuccess, onError]);

    /**
     * Elimina un item
     */
    const handleDelete = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await deleteItem(id);
            setItems(prev => prev.filter(item => item.id !== id));
            onSuccess?.('delete');
        } catch (error) {
            onError?.(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [deleteItem, onSuccess, onError]);

    return {
        items,
        loading,
        selectedItem,
        setSelectedItem,
        loadItems,
        handleCreate,
        handleUpdate,
        handleDelete
    };
}
