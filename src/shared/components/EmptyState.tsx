import { cn } from '../lib/utils';
import { Icon } from './Icon';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

/**
 * EmptyState component for displaying friendly messages when no data is available
 * 
 * @example
 * <EmptyState
 *   icon="inbox"
 *   title="No hay tickets"
 *   description="No se encontraron tickets en tu bandeja"
 *   action={{ label: "Crear ticket", onClick: () => navigate('/tickets/create') }}
 * />
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Icon
                    name={icon}
                    className="text-5xl text-gray-400"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent transition-colors"
                >
                    <Icon name="add_circle" className="text-base" style={{ fontVariationSettings: '"FILL" 1' }} />
                    {action.label}
                </button>
            )}
        </div>
    );
}
