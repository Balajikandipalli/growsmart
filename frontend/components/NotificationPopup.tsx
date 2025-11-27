'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationPopupProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

export default function NotificationPopup({ notifications, onClose }: NotificationPopupProps) {
    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getColorClasses = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'border-green-500/20 bg-green-50/90';
            case 'warning':
                return 'border-yellow-500/20 bg-yellow-50/90';
            case 'error':
                return 'border-red-500/20 bg-red-50/90';
            default:
                return 'border-blue-500/20 bg-blue-50/90';
        }
    };

    return (
        <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification, index) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="pointer-events-auto"
                    >
                        <div
                            className={`
                                max-w-sm w-full backdrop-blur-md border rounded-xl shadow-lg p-4
                                ${getColorClasses(notification.type)}
                                ${notification.onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}
                            `}
                            onClick={notification.onClick}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-foreground mb-1">
                                        {notification.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose(notification.id);
                                    }}
                                    className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
