
import { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { tagService, type Tag } from '../services/tag.service';
import { ticketService } from '../services/ticket.service';
import { Icon } from '../../../shared/components/Icon';

interface TagManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId?: number | null;
    currentTags?: { id: number; name: string; color: string }[];
    onTagAssigned?: () => void;
}

export default function TagManagementModal({ isOpen, onClose, ticketId, currentTags, onTagAssigned }: TagManagementModalProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'list' | 'create'>('list');

    // Create Form
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3B82F6');

    useEffect(() => {
        if (isOpen) {
            loadTags();
            setView('list');
        }
    }, [isOpen]);

    const loadTags = async () => {
        try {
            setLoading(true);
            const data = await tagService.getMyTags();
            setTags(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load tags", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        try {
            setLoading(true);
            await tagService.createTag({ nombre: newTagName, color: newTagColor });
            setNewTagName('');
            setView('list');
            loadTags();
        } catch (error) {
            console.error("Failed to create tag", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTag = async (tag: Tag) => {
        if (!ticketId) return;
        try {
            const isAssigned = currentTags?.some(t => t.id === tag.id);
            if (isAssigned) {
                await ticketService.removeTag(ticketId, tag.id);
            } else {
                await ticketService.addTag(ticketId, tag.id);
            }
            if (onTagAssigned) onTagAssigned();
            onClose();
        } catch (error) {
            console.error("Failed to toggle tag", error);
        }
    };

    const handleDeleteTag = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) return;
        try {
            await tagService.deleteTag(id);
            loadTags();
        } catch (error) {
            console.error("Failed to delete tag", error);
        }
    };

    const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280'];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={view === 'list'
                ? (ticketId ? 'Gestionar Etiquetas' : 'Mis Etiquetas')
                : 'Nueva Etiqueta'
            }
            className="max-w-md"
        >
            <div className="space-y-6">
                {view === 'list' ? (
                    <>
                        <div className="min-h-[120px]">
                            {loading && tags.length === 0 ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {tags.length === 0 && (
                                        <div className="w-full text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <Icon name="label_off" className="text-gray-400 text-3xl mb-2" />
                                            <p className="text-gray-500 text-sm">No tienes etiquetas creadas.</p>
                                        </div>
                                    )}
                                    {tags.map(tag => {
                                        const isAssigned = ticketId && currentTags?.some(t => t.id === tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                onClick={() => ticketId ? handleToggleTag(tag) : null}
                                                className={`
                                                    group relative inline-flex items-center rounded-full pl-2.5 pr-3 py-1 text-sm font-medium transition-all
                                                    border border-transparent
                                                    ${ticketId ? 'hover:shadow-sm hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}
                                                    ${isAssigned ? 'ring-2 ring-offset-1 ring-green-500 opacity-90' : 'hover:border-opacity-20'}
                                                `}
                                                style={{
                                                    backgroundColor: tag.color + '15',
                                                    color: tag.color,
                                                    borderColor: ticketId ? tag.color + '30' : 'transparent'
                                                }}
                                                title={ticketId ? (isAssigned ? 'Click para remover' : 'Click para asignar') : ''}
                                            >
                                                <span className="mr-1.5 inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                                {tag.nombre}

                                                {isAssigned && (
                                                    <Icon name="check" className="ml-1.5 text-[16px]" />
                                                )}

                                                {!ticketId && (
                                                    <div
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteTag(tag.id); }}
                                                        className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                                        title="Eliminar etiqueta"
                                                    >
                                                        <Icon name="close" className="text-[16px] block" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button
                                variant="brand"
                                onClick={() => setView('create')}
                                className="w-full sm:w-auto"
                            >
                                <Icon name="add" className="mr-2 text-sm" />
                                Nueva Etiqueta
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Input
                                label="Nombre de la etiqueta"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Ej. Urgente"
                                autoFocus
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewTagColor(color)}
                                            className={`
                                                h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-blue
                                                ${newTagColor === color ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent'}
                                            `}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            {newTagName && (
                                <div className="p-4 bg-gray-50 rounded-lg flex justify-center items-center">
                                    <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border"
                                        style={{
                                            backgroundColor: newTagColor + '15',
                                            color: newTagColor,
                                            borderColor: newTagColor + '30'
                                        }}>
                                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: newTagColor }}></span>
                                        {newTagName}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" onClick={() => setView('list')} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                variant="brand"
                                onClick={handleCreateTag}
                                disabled={!newTagName.trim() || loading}
                            >
                                {loading ? 'Creando...' : 'Guardar'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
