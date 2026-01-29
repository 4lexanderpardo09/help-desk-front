import type { TicketTimelineItem } from '../interfaces/Ticket';
import DOMPurify from 'dompurify';

interface TicketTimelineProps {
    items: TicketTimelineItem[];
}

export function TicketTimeline({ items }: TicketTimelineProps) {
    return (
        <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:left-[27px] before:h-full before:w-0.5 before:bg-gray-200">
            {items.map((item, index) => (
                <div key={item.id || index} className="relative flex gap-6">
                    {/* Avatar / Icon */}
                    <div className="absolute left-0 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f6f8f8] bg-white">
                        {item.type === 'comment' ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-brand-blue font-bold">
                                {item.authorAvatar || 'U'}
                            </div>
                        ) : item.type === 'status_change' ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <span className="material-symbols-outlined text-xl">cached</span>
                            </div>
                        ) : item.type === 'assignment' ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                <span className="material-symbols-outlined text-xl">person_add</span>
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                <span className="material-symbols-outlined text-xl">info</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className={`ml-12 w-full rounded-xl border bg-white p-5 shadow-sm 
                        ${item.type === 'status_change' ? 'border-l-4 border-gray-200 border-l-brand-teal p-4' : 'border-gray-200'}`}>

                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-gray-900">{item.author}</span>
                                {item.authorRole && (
                                    <span className="ml-2 text-xs text-brand-accent font-medium bg-blue-50 px-2 py-0.5 rounded">
                                        {item.authorRole}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400">{new Date(item.date).toLocaleString()}</span>
                        </div>

                        {item.type === 'status_change' ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-900">
                                    Estado actualizado a <span className="text-brand-teal">{item.metadata?.newStatus || 'Desconocido'}</span>
                                </span>
                            </div>
                        ) : item.type === 'assignment' ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-900 font-medium">
                                    {item.content}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {item.asignadoA && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
                                            <span className="material-symbols-outlined text-[18px]">person</span>
                                            <span>Asignado a: <strong>{item.asignadoA.nombre}</strong></span>
                                        </div>
                                    )}
                                    {/* SLA Status Badge */}
                                    {item.metadata?.estadoTiempoPaso && (
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${['Atrasado', 'Vencido'].includes(item.metadata.estadoTiempoPaso)
                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {['Atrasado', 'Vencido'].includes(item.metadata.estadoTiempoPaso) ? 'warning' : 'check_circle'}
                                            </span>
                                            {item.metadata.estadoTiempoPaso}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="text-sm text-gray-600 leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
                            />
                        )}

                        {item.metadata?.attachments && item.metadata.attachments.length > 0 && (
                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adjuntos</h4>
                                <div className="flex flex-wrap gap-2">
                                    {item.metadata.attachments.map((att) => (
                                        <a
                                            key={att.id}
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-white hover:text-brand-blue hover:shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">description</span>
                                            {att.nombre}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
