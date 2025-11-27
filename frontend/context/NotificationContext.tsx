'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useNotifications as useNotificationsHook } from '@/hooks/useNotifications';
import NotificationPopup from '@/components/NotificationPopup';

const NotificationContext = createContext<ReturnType<typeof useNotificationsHook> | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const notificationMethods = useNotificationsHook();

    return (
        <NotificationContext.Provider value={notificationMethods}>
            {children}
            <NotificationPopup
                notifications={notificationMethods.notifications}
                onClose={notificationMethods.removeNotification}
            />
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
