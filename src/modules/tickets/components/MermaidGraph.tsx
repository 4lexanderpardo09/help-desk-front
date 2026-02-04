import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ticketService } from '../services/ticket.service';

interface MermaidGraphProps {
    subcategoryId?: number;
    currentStepId: number;
    historyStepIds?: number[];
}

interface WorkflowData {
    pasos: any[];
    rutas: any[];
}

export function MermaidGraph({ subcategoryId, currentStepId, historyStepIds = [] }: MermaidGraphProps) {
    const [flowData, setFlowData] = useState<WorkflowData | null>(null);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                primaryColor: '#f0f9ff',
                primaryTextColor: '#334155',
                primaryBorderColor: '#cbd5e1',
                lineColor: '#94a3b8',
                secondaryColor: '#fdfce7',
                tertiaryColor: '#fff',
            },
            flowchart: {
                curve: 'basis',
                htmlLabels: true,
                padding: 20
            }
        });
    }, []);

    useEffect(() => {
        if (!subcategoryId) return;
        setLoading(true);
        ticketService.getWorkflowGraph(subcategoryId)
            .then(data => setFlowData(data))
            .catch(err => console.error("Error loading workflow graph", err))
            .finally(() => setLoading(false));
    }, [subcategoryId, currentStepId]);

    useEffect(() => {
        if (!flowData || !containerRef.current) return;

        const buildGraph = async () => {
            const lines: string[] = ['graph TD'];
            const allStepsMap = new Map<number, any>();
            const edges: string[] = [];
            const stepsInRoutes = new Set<number>();
            const routeStartMap = new Map<number, number>();

            // 1. Process Routes
            if (flowData.rutas) {
                flowData.rutas.forEach((ruta: any) => {
                    const rutaPasos = ruta.rutaPasos?.sort((a: any, b: any) => a.orden - b.orden) || [];
                    if (rutaPasos.length > 0) {
                        routeStartMap.set(ruta.id, rutaPasos[0].paso.id);
                        rutaPasos.forEach((rp: any, index: number) => {
                            const step = rp.paso;
                            stepsInRoutes.add(step.id);
                            allStepsMap.set(step.id, { ...step, isRoute: true });

                            // Define node
                            lines.push(`  step${step.id}["${escapeLabel(step.nombre)}"]`);

                            // Internal route connection
                            if (index < rutaPasos.length - 1) {
                                const nextStepId = rutaPasos[index + 1].paso.id;
                                edges.push(`  step${step.id} --> step${nextStepId}`);
                            }
                        });
                    }
                });
            }

            // 2. Process Main Steps
            flowData.pasos.forEach((p: any) => {
                if (!allStepsMap.has(p.id)) {
                    allStepsMap.set(p.id, { ...p, isRoute: false });
                    lines.push(`  step${p.id}["${escapeLabel(p.nombre)}"]`);
                }
            });

            // 3. Process Transitions
            const processTransitions = (stepId: number, transitions: any[]) => {
                if (!transitions) return;
                transitions.forEach((t: any) => {
                    let targetId: number | undefined;

                    if (t.rutaId) {
                        targetId = routeStartMap.get(t.rutaId);
                    } else if (t.pasoDestinoId) {
                        targetId = t.pasoDestinoId;
                    }

                    if (targetId) {
                        const label = t.condicionNombre || t.condicionClave || '';
                        const arrow = label ? `-->|"${escapeLabel(label)}"|` : '-->';
                        edges.push(`  step${stepId} ${arrow} step${targetId}`);
                    }
                });
            };

            // Main steps transitions
            flowData.pasos.forEach((p: any) => {
                processTransitions(p.id, p.transicionesOrigen);
            });

            // Route steps transitions (exits)
            if (flowData.rutas) {
                flowData.rutas.forEach((ruta: any) => {
                    ruta.rutaPasos?.forEach((rp: any) => {
                        if (rp.paso && rp.paso.transicionesOrigen) {
                            processTransitions(rp.paso.id, rp.paso.transicionesOrigen);
                        }
                    });
                });
            }

            // 4. Implicit Linear Connections (Main Flow)
            const sortedMainSteps = [...flowData.pasos]
                .filter(p => !stepsInRoutes.has(p.id))
                .sort((a, b) => a.orden - b.orden);

            sortedMainSteps.forEach((p, idx) => {
                if ((!p.transicionesOrigen || p.transicionesOrigen.length === 0) && idx < sortedMainSteps.length - 1) {
                    const nextStep = sortedMainSteps[idx + 1];
                    // Check if edge already exists
                    const edgeExists = edges.some(e => e.includes(`step${p.id} `) && e.includes(`step${nextStep.id}`));
                    if (!edgeExists) {
                        edges.push(`  step${p.id} --> step${nextStep.id}`);
                    }
                }
            });

            // Add all edges to lines
            lines.push(...Array.from(new Set(edges)));

            // 5. Styles
            // Current Step
            lines.push(`  style step${currentStepId} fill:#0ea5e9,stroke:#0369a1,stroke-width:3px,color:#fff`);

            // Visited Steps
            historyStepIds.forEach(id => {
                if (id !== currentStepId) {
                    lines.push(`  style step${id} fill:#dcfce7,stroke:#16a34a,stroke-width:2px`);
                }
            });

            // Render
            const graphDefinition = lines.join('\n');
            try {
                // Clear previous result
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, graphDefinition);
                    containerRef.current.innerHTML = svg;
                }
            } catch (error) {
                console.error('Mermaid render error:', error);
                if (containerRef.current) {
                    containerRef.current.textContent = 'Error al renderizar el flujo.';
                }
            }
        };

        buildGraph();

    }, [flowData, currentStepId, historyStepIds]);

    const escapeLabel = (str: string) => {
        if (!str) return '';
        return str.replace(/["#]/g, '');
    };

    if (loading) return <div className="text-gray-400 text-xs text-center py-4">Cargando visualización del flujo...</div>;
    if (!flowData) return <div className="text-gray-400 text-xs text-center py-4">No se encontraron datos del flujo.</div>;

    return (
        <div
            className="w-full overflow-x-auto p-4 bg-slate-50 border border-slate-100 rounded-lg flex justify-center min-h-[300px]"
            ref={containerRef}
            style={{ fontFamily: 'var(--font-sans)' }}
        />
    );
}
