import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../core/layout/DashboardLayout';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { ticketService } from '../services/ticket.service';
import { categoryService } from '../services/category.service';
import { subcategoryService } from '../services/subcategory.service';
import { priorityService } from '../services/priority.service';
import { workflowService } from '../services/workflow.service';
import { useAuth } from '../../auth/context/useAuth';
import type { Category } from '../interfaces/Category';
import type { Subcategory } from '../interfaces/Subcategory';
import type { Priority } from '../interfaces/Priority';
import type { CreateTicketDto } from '../interfaces/Ticket';
import type { UserCandidate } from '../interfaces/Workflow';

export default function CreateTicketPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // UI State
    const [loading, setLoading] = useState(false);
    const [checkingFlow, setCheckingFlow] = useState(false);

    // Data State
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [assigneeCandidates, setAssigneeCandidates] = useState<UserCandidate[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
    const [priorityId, setPriorityId] = useState<number | ''>('');
    const [assigneeId, setAssigneeId] = useState<number | ''>('');

    // Workflow Logic State
    const [requiresManualSelection, setRequiresManualSelection] = useState(false);
    const [initialStepName, setInitialStepName] = useState<string>('');

    // 1. Initial Load (Categories & Priorities)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [cats, prios] = await Promise.all([
                    categoryService.getCategories(),
                    priorityService.getPriorities()
                ]);
                setCategories(cats);
                setPriorities(prios);
            } catch (error) {
                console.error("Error loading initial data", error);
            }
        };
        loadInitialData();
    }, []);

    // 2. Load Subcategories when Category changes
    useEffect(() => {
        if (!categoryId) {
            setSubcategories([]);
            setSubcategoryId('');
            return;
        }

        const loadSubcategories = async () => {
            try {
                const subs = await subcategoryService.getByCategory(categoryId as number);
                setSubcategories(subs);
            } catch (error) {
                console.error("Error loading subcategories", error);
                setSubcategories([]);
            }
        };
        loadSubcategories();
        // Reset subcategory selection
        setSubcategoryId('');
        setRequiresManualSelection(false);
        setAssigneeId('');
    }, [categoryId]);

    // 3. Check Workflow when Subcategory changes
    useEffect(() => {
        if (!subcategoryId) {
            setRequiresManualSelection(false);
            setAssigneeCandidates([]);
            setInitialStepName('');
            setAssigneeId('');
            return;
        }

        const checkWorkflow = async () => {
            setCheckingFlow(true);
            try {
                const result = await workflowService.checkStartFlow(subcategoryId as number);
                setRequiresManualSelection(result.requiresManualSelection);
                setInitialStepName(result.initialStepName);

                if (result.requiresManualSelection) {
                    setAssigneeCandidates(result.candidates);
                } else {
                    setAssigneeCandidates([]);
                }
            } catch (error) {
                console.error("Error checking workflow", error);
            } finally {
                setCheckingFlow(false);
            }
        };
        checkWorkflow();
    }, [subcategoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !categoryId || !subcategoryId) return;
        if (requiresManualSelection && !assigneeId) return;

        setLoading(true);
        try {
            const payload: CreateTicketDto = {
                titulo: title,
                descripcion: description,
                categoriaId: Number(categoryId),
                subcategoriaId: Number(subcategoryId),
                prioridadId: priorityId ? Number(priorityId) : undefined,
                usuarioAsignadoId: assigneeId ? Number(assigneeId) : undefined,
                usuarioId: user?.id
            };

            await ticketService.createTicket(payload);
            navigate('/tickets');
        } catch (error) {
            console.error("Error creating ticket", error);
            alert("Error creando el ticket. Por favor intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Crear Ticket">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate('/tickets')} className="pl-0 hover:bg-transparent">
                        <span className="material-symbols-outlined mr-2">arrow_back</span>
                        Volver a Tickets
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Crear Nuevo Ticket</h1>
                    <p className="text-sm text-gray-500">Complete los detalles para enviar una nueva solicitud de soporte.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">

                            <Input
                                label="Asunto"
                                placeholder="Resumen breve del problema"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* CATEGORY */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
                                    <select
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal sm:text-sm"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">Seleccione Categoría...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* SUBCATEGORY */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Subcategoría <span className="text-red-500">*</span></label>
                                    <select
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                        value={subcategoryId}
                                        onChange={(e) => setSubcategoryId(Number(e.target.value))}
                                        required
                                        disabled={!categoryId}
                                    >
                                        <option value="">{categoryId ? 'Seleccione Subcategoría...' : 'Seleccione Categoría primero'}</option>
                                        {subcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* WORKFLOW INFO & ASSIGNMENT */}
                            {subcategoryId && (
                                <div className={`rounded-md p-4 border ${checkingFlow ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
                                    {checkingFlow ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-brand-blue rounded-full"></div>
                                            Verificando requisitos del flujo...
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900">
                                                        Flujo: {initialStepName || 'Flujo Estándar'}
                                                    </p>
                                                    <p className="text-xs text-blue-700 mt-1">
                                                        {requiresManualSelection
                                                            ? "Este ticket requiere que seleccione un asignado manualmente."
                                                            : "Este ticket será asignado automáticamente según las reglas del flujo."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* MANUAL ASSIGNMENT SELECTOR */}
                                            {requiresManualSelection && (
                                                <div className="pt-2">
                                                    <label className="text-sm font-medium text-blue-900 block mb-1">
                                                        Asignar a <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        className="block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        value={assigneeId}
                                                        onChange={(e) => setAssigneeId(Number(e.target.value))}
                                                        required
                                                    >
                                                        <option value="">Seleccione un usuario...</option>
                                                        {assigneeCandidates.map(cand => (
                                                            <option key={cand.id} value={cand.id}>
                                                                {cand.nombre} {cand.apellido} {cand.cargo ? `(${cand.cargo})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PRIORITY & DESC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Prioridad (Opcional)</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal sm:text-sm"
                                    value={priorityId}
                                    onChange={(e) => setPriorityId(Number(e.target.value))}
                                >
                                    <option value="">Prioridad por defecto</option>
                                    {priorities.map(prio => (
                                        <option key={prio.id} value={prio.id}>{prio.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Descripción <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={5}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal sm:text-sm"
                                    placeholder="Proporcione una descripción detallada de la solicitud o incidente..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button type="button" variant="ghost" onClick={() => navigate('/tickets')}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="brand" disabled={loading || checkingFlow}>
                                    {loading ? 'Creando Ticket...' : 'Crear Ticket'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: USER CARD & TIPS */}
                    <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Información del Solicitante</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {user?.nombre?.[0]}{user?.apellido?.[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user?.nombre} {user?.apellido}</p>
                                    <p className="text-sm text-gray-500">{user?.role?.nombre}</p>
                                    <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">Consejos Útiles</h4>
                                <ul className="text-sm text-gray-500 space-y-2 list-disc pl-4">
                                    <li>Proporcione un asunto claro y conciso.</li>
                                    <li>Seleccione la categoría más relevante para asegurar que el ticket llegue al equipo correcto.</li>
                                    <li>Incluya detalles específicos en la descripción (IDs, mensajes de error, ubicaciones).</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
