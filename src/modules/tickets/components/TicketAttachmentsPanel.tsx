import { ticketService } from '../services/ticket.service';
import { Icon } from '../../../shared/components/Icon';

interface Attachment {
    id: number;
    nombre: string;
    url: string;
}

interface TicketAttachmentsPanelProps {
    attachments: Attachment[];
}

/**
 * Panel that shows the files attached during ticket creation.
 * These are Documento entities (document/ticket/{ticketId}/) and are
 * intentionally shown separately from the activity timeline.
 */
export function TicketAttachmentsPanel({ attachments }: TicketAttachmentsPanelProps) {
    if (attachments.length === 0) return null;

    const getFileIcon = (nombre: string) => {
        const ext = nombre.split('.').pop()?.toLowerCase() || '';
        if (['pdf'].includes(ext)) return 'picture_as_pdf';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
        if (['doc', 'docx'].includes(ext)) return 'description';
        if (['xls', 'xlsx'].includes(ext)) return 'table_chart';
        if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip';
        return 'attach_file';
    };

    const getFileColor = (nombre: string) => {
        const ext = nombre.split('.').pop()?.toLowerCase() || '';
        if (['pdf'].includes(ext)) return 'text-red-500';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'text-purple-500';
        if (['doc', 'docx'].includes(ext)) return 'text-blue-500';
        if (['xls', 'xlsx'].includes(ext)) return 'text-green-600';
        return 'text-gray-400';
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 no-print">
            <div className="flex items-center gap-2 mb-3">
                <Icon name="attach_file" className="text-[18px] text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">
                    Adjuntos del ticket
                </h4>
                <span className="ml-auto text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    {attachments.length} {attachments.length === 1 ? 'archivo' : 'archivos'}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                    <button
                        key={att.id}
                        type="button"
                        onClick={() => ticketService.downloadFile(att.url, att.nombre)}
                        className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition-all hover:border-gray-300 hover:bg-white hover:shadow-sm max-w-xs"
                        title={att.nombre}
                    >
                        <Icon
                            name={getFileIcon(att.nombre)}
                            className={`text-[18px] shrink-0 ${getFileColor(att.nombre)}`}
                        />
                        <span className="truncate text-xs font-medium text-gray-700 group-hover:text-gray-900">
                            {att.nombre}
                        </span>
                        <Icon name="download" className="text-[14px] text-gray-300 shrink-0 group-hover:text-gray-500 ml-auto" />
                    </button>
                ))}
            </div>
        </div>
    );
}
