import { createContext, useContext, type ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useToast } from '../hooks/useToast';
import type { Notification } from '../interfaces/notification.interface';

interface NotificationsContextValue {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: (page?: number, limit?: number) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    toasts: ReturnType<typeof useToast>['toasts'];
    removeToast: ReturnType<typeof useToast>['removeToast'];
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

interface NotificationsProviderProps {
    children: ReactNode;
}

/**
 * Provider that manages notifications state globally.
 * This ensures all components share the same notification state.
 */
export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const { toasts, removeToast, showToast } = useToast();
    const notificationsData = useNotifications({ showToast });

    return (
        <NotificationsContext.Provider
            value={{
                ...notificationsData,
                toasts,
                removeToast,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

/**
 * Hook to access notifications context.
 * Must be used within NotificationsProvider.
 */
export function useNotificationsContext() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotificationsContext must be used within NotificationsProvider');
    }
    return context;
}
