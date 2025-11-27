import { useState, useEffect, useCallback, useRef } from 'react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    onClick?: () => void;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const notificationIdCounter = useRef(0);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        }

        return false;
    }, []);

    const showBrowserNotification = useCallback(async (title: string, options?: NotificationOptions) => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options,
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
                if (options?.data?.url) {
                    window.location.href = options.data.url;
                }
            };

            return notification;
        } else if (Notification.permission === 'default') {
            const granted = await requestPermission();
            if (granted) {
                return showBrowserNotification(title, options);
            }
        }
    }, [requestPermission]);

    const showInAppNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        // Generate unique ID using timestamp + counter
        const id = `${Date.now()}-${++notificationIdCounter.current}`;
        const newNotification: Notification = {
            id,
            duration: 5000,
            ...notification,
        };

        setNotifications((prev) => [...prev, newNotification]);

        if (newNotification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showReminderNotification = useCallback(async (plantName: string, taskType: string, reminderUrl: string = '/reminders') => {
        // Show browser notification
        await showBrowserNotification(`🌱 Plant Care Reminder`, {
            body: `Time to ${taskType} your ${plantName}!`,
            tag: 'plant-reminder',
            requireInteraction: false,
            data: { url: reminderUrl },
        });

        // Show in-app notification
        showInAppNotification({
            title: 'Plant Care Reminder',
            message: `Time to ${taskType} your ${plantName}!`,
            type: 'info',
            onClick: () => {
                window.location.href = reminderUrl;
            },
        });
    }, [showBrowserNotification, showInAppNotification]);

    return {
        notifications,
        permission,
        requestPermission,
        showBrowserNotification,
        showInAppNotification,
        removeNotification,
        showReminderNotification,
    };
}
