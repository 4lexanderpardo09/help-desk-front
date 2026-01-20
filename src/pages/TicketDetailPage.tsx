import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ticketService } from '../services/ticket.service';
import type { TicketDetail, TicketTimelineItem, TicketStatus, TicketPriority } from '../interfaces/Ticket';
import { Button } from '../components/ui/Button';
import { TicketWorkflow } from '../components/tickets/TicketWorkflow';
import { TicketTimeline } from '../components/tickets/TicketTimeline';

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [timeline, setTimeline] = useState<TicketTimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [ticketData, timelineData] = await Promise.all([
                    ticketService.getTicket(Number(id)),
                    ticketService.getTicketTimeline(Number(id))
                ]);
                setTicket(ticketData);
                setTimeline(timelineData);
            } catch (error) {
                console.error("Error fetching ticket details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'Open': return 'bg-cyan-50 text-brand-teal ring-brand-teal/20';
            case 'In Progress': return 'bg-blue-50 text-brand-accent ring-brand-accent/20';
            case 'Resolved': return 'bg-green-50 text-green-600 ring-green-600/20';
            case 'Closed': return 'bg-gray-100 text-gray-600 ring-gray-600/20';
            default: return 'bg-gray-100 text-gray-600 ring-gray-600/20';
        }
    };

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-brand-red ring-brand-red/20';
            case 'Medium': return 'bg-orange-50 text-orange-600 ring-orange-600/20';
            case 'Low': return 'bg-green-50 text-green-600 ring-green-600/20';
            default: return 'bg-gray-50 text-gray-600 ring-gray-600/20';
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Ticket Details">
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500">Loading ticket details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!ticket) {
        return (
            <DashboardLayout title="Ticket Not Found">
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <p className="text-gray-500">The requested ticket could not be found.</p>
                    <Button variant="secondary" onClick={() => navigate('/tickets')}>
                        Back to Tickets
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={`Ticket #${ticket.id}`}>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="!p-0 text-gray-400 hover:text-gray-600" onClick={() => navigate('/tickets')}>
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </Button>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Ticket #{ticket.id} - {ticket.subject}
                        </h2>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500 pl-9">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Created: {new Date(ticket.createdDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Customer: {ticket.customer}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">folder</span>
                            Category: {ticket.category}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">
                        <span className="material-symbols-outlined mr-2">print</span>
                        Print
                    </Button>
                    <Button variant="brand">
                        <span className="material-symbols-outlined mr-2">edit</span>
                        Edit Ticket
                    </Button>
                </div>
            </div>

            <TicketWorkflow ticket={ticket} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Activity Timeline</h3>
                        <div className="flex gap-2">
                            <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">All Activity</button>
                            <button className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">Comments Only</button>
                            <button className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">History</button>
                        </div>
                    </div>

                    <TicketTimeline items={timeline} />
                </div>
            </div>

        </DashboardLayout>
    );
}
