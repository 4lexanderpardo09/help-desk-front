import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { notificationsWs } from '../services/notifications-ws.service';
import type { Notification } from '../interfaces/notification.interface';
import type { Toast } from './useToast';

interface UseNotificationsOptions {
    showToast?: (toast: Omit<Toast, 'id'>, onDismiss?: () => void) => void;
}

/**
 * Hook for managing notifications with WebSocket and REST API.
 * Provides real-time updates and methods to fetch/mark notifications.
 * Also displays toast notifications for real-time events if showToast is provided.
 */
export function useNotifications(options?: UseNotificationsOptions) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = options || {};

    /**
     * Fetch unread count from API
     */
    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationsApi.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('[useNotifications] Error fetching unread count:', error);
        }
    }, []);

    /**
     * Fetch notifications from API
     */
    /**
     * Fetch notifications from API
     * By default, we now only fetch UNREAD notifications (status=2) for the bell dropdown.
     * If we wanted a full history page, we would need a separate hook or param.
     * For now, the requirement is "hide read notifications".
     */
    const fetchNotifications = useCallback(async (page: number = 1, limit: number = 20) => {
        setLoading(true);
        try {
            // Hardcoded status=2 (Pendiente/Unread) to ensure we only get unread ones
            const response = await notificationsApi.getNotifications(page, limit, 2);
            setNotifications(response.data);
        } catch (error) {
            console.error('[useNotifications] Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Mark a notification as read
     * Now removes it from the list instead of just updating status.
     */
    const markAsRead = useCallback(async (id: number) => {
        try {
            await notificationsApi.markAsRead(id);
            // Remove from list because we only want to show unread
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('[useNotifications] Error marking as read:', error);
        }
    }, []);

    /**
     * Mark all notifications as read
     * Now clears the list.
     */
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationsApi.markAllAsRead();
            // Clear list because all are now read
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('[useNotifications] Error marking all as read:', error);
        }
    }, []);


    /**
     * Handle new notification from WebSocket
     */
    const handleNewNotification = useCallback((data: any) => {


        // Add to notifications list
        const newNotification: Notification = {
            id: data.id || Date.now(),
            mensaje: data.mensaje,
            ticketId: data.ticketId,
            fechaNotificacion: new Date(data.fecha),
            estado: 2, // Pendiente (legacy format)
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show toast notification if available
        if (showToast) {
            showToast({
                message: data.mensaje,
                type: 'info',
                ticketId: data.ticketId,
                duration: 6000,
            });
        }
    }, [showToast]);

    /**
     * Handle ticket overdue notification
     */
    const handleTicketOverdue = useCallback((data: any) => {


        // Show warning toast if available
        if (showToast) {
            showToast({
                message: `⚠️ Ticket #${data.ticketId} ha vencido su SLA`,
                type: 'warning',
                ticketId: data.ticketId,
                duration: 8000,
            }, () => {
                // If we had a real notification ID here, we would markAsSeen
                // data.id might be available if backend sends it
            });
        }
    }, [showToast]);

    /**
     * Handle ticket closed notification
     */
    const handleTicketClosed = useCallback((data: any) => {


        // Add to notifications list
        const newNotification: Notification = {
            id: data.id || Date.now(),
            mensaje: data.mensaje,
            ticketId: data.ticketId,
            fechaNotificacion: new Date(data.fecha),
            estado: 2, // Pendiente (legacy format)
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show success toast if available
        if (showToast) {
            showToast({
                message: data.mensaje,
                type: 'success',
                ticketId: data.ticketId,
                duration: 6000,
            });
        }
    }, [showToast]);

    useEffect(() => {
        // Connect to WebSocket
        notificationsWs.connect();

        // Subscribe to events
        notificationsWs.on('new_notification', handleNewNotification);
        notificationsWs.on('ticket_overdue', handleTicketOverdue);
        notificationsWs.on('ticket_closed', handleTicketClosed);

        // Fetch initial data
        fetchUnreadCount();
        fetchNotifications();

        // Cleanup on unmount
        return () => {
            notificationsWs.off('new_notification', handleNewNotification);
            notificationsWs.off('ticket_overdue', handleTicketOverdue);
            notificationsWs.off('ticket_closed', handleTicketClosed);
        };
    }, [handleNewNotification, handleTicketOverdue, handleTicketClosed, fetchUnreadCount, fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
}
