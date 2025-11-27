'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslate } from '@/hooks/useTranslate';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Edit2, Calendar, Droplet, Scissors, Sprout, Loader2, X, BellRing } from 'lucide-react';
import Link from 'next/link';
import ReminderCard from '@/components/ReminderCard';

interface Reminder {
    _id: string;
    plantName: string;
    taskType: 'watering' | 'fertilizing' | 'pruning' | 'other';
    frequency: string;
    nextDue: string;
    notes?: string;
}

export default function RemindersPage() {
    const { t } = useLanguage();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const { user } = useAuth();
    const { permission, requestPermission, showReminderNotification, showInAppNotification } = useNotifications();

    const [formData, setFormData] = useState({
        plantName: '',
        taskType: 'watering' as Reminder['taskType'],
        frequency: 'daily',
        notes: '',
    });

    useEffect(() => {
        if (user) {
            fetchReminders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Check for due reminders and send notifications
    useEffect(() => {
        if (reminders.length === 0) return;

        const checkDueReminders = () => {
            const now = new Date();
            reminders.forEach((reminder) => {
                const dueDate = new Date(reminder.nextDue);
                const diffTime = dueDate.getTime() - now.getTime();
                const diffHours = diffTime / (1000 * 60 * 60);

                // Notify if reminder is due within 24 hours
                if (diffHours > 0 && diffHours <= 24) {
                    showReminderNotification(reminder.plantName, reminder.taskType);
                }
            });
        };

        // Check immediately and then every hour
        checkDueReminders();
        const interval = setInterval(checkDueReminders, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [reminders, showReminderNotification]);

    const fetchReminders = async () => {
        try {
            // Mock data for now - replace with actual API call when backend is ready
            const mockReminders: Reminder[] = [
                {
                    _id: '1',
                    plantName: 'Tomato Plants',
                    taskType: 'watering',
                    frequency: 'Daily',
                    nextDue: new Date(Date.now() + 86400000).toISOString(),
                    notes: 'Water in the morning',
                },
                {
                    _id: '2',
                    plantName: 'Rose Garden',
                    taskType: 'fertilizing',
                    frequency: 'Weekly',
                    nextDue: new Date(Date.now() + 3 * 86400000).toISOString(),
                    notes: 'Use organic fertilizer',
                },
                {
                    _id: '3',
                    plantName: 'Herb Garden',
                    taskType: 'pruning',
                    frequency: 'Monthly',
                    nextDue: new Date(Date.now() + 7 * 86400000).toISOString(),
                },
            ];
            setReminders(mockReminders);
        } catch (error) {
            console.error('Failed to fetch reminders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mock submission - replace with actual API call
        const newReminder: Reminder = {
            _id: Date.now().toString(),
            plantName: formData.plantName,
            taskType: formData.taskType,
            frequency: formData.frequency,
            nextDue: new Date(Date.now() + 86400000).toISOString(),
            notes: formData.notes,
        };

        if (editingReminder) {
            setReminders(reminders.map(r => r._id === editingReminder._id ? { ...newReminder, _id: editingReminder._id } : r));
        } else {
            setReminders([...reminders, newReminder]);
        }

        setShowAddModal(false);
        setEditingReminder(null);
        setFormData({ plantName: '', taskType: 'watering', frequency: 'daily', notes: '' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reminder?')) return;
        setReminders(reminders.filter(r => r._id !== id));
    };

    const handleEdit = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setFormData({
            plantName: reminder.plantName,
            taskType: reminder.taskType,
            frequency: reminder.frequency.toLowerCase(),
            notes: reminder.notes || '',
        });
        setShowAddModal(true);
    };

    const getTaskIcon = (taskType: Reminder['taskType']) => {
        switch (taskType) {
            case 'watering': return Droplet;
            case 'fertilizing': return Sprout;
            case 'pruning': return Scissors;
            default: return Bell;
        }
    };

    const getTaskColor = (taskType: Reminder['taskType']) => {
        switch (taskType) {
            case 'watering': return 'text-blue-500 bg-blue-500/10';
            case 'fertilizing': return 'text-green-500 bg-green-500/10';
            case 'pruning': return 'text-orange-500 bg-orange-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        return date.toLocaleDateString();
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h2 className="text-2xl font-bold mb-4">{t.auth.loginTitle}</h2>
                <p className="text-muted-foreground mb-6">{t.reminders.loginRequired}</p>
                <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    {t.nav.login}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                        {t.reminders.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {t.reminders.subtitle}
                    </p>
                </div>
                <div className="flex gap-3">
                    {permission !== 'granted' && (
                        <motion.button
                            onClick={async () => {
                                const granted = await requestPermission();
                                if (granted) {
                                    showInAppNotification({
                                        title: 'Notifications Enabled',
                                        message: 'You will now receive reminders for your plants!',
                                        type: 'success',
                                    });
                                }
                            }}
                            className="bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <BellRing className="w-5 h-5" />
                            {t.reminders.enableNotifications}
                        </motion.button>
                    )}
                    <motion.button
                        onClick={() => {
                            setEditingReminder(null);
                            setFormData({ plantName: '', taskType: 'watering', frequency: 'daily', notes: '' });
                            setShowAddModal(true);
                        }}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-5 h-5" />
                        {t.reminders.addReminder}
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : reminders.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t.reminders.noReminders}</h3>
                    <p className="text-muted-foreground mb-6">{t.reminders.createFirst}</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        {t.reminders.createReminder}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {reminders.map((reminder) => (
                            <ReminderCard
                                key={reminder._id}
                                reminder={reminder}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    {editingReminder ? t.reminders.editReminder : t.reminders.addNewReminder}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.reminders.plantName}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.plantName}
                                        onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
                                        className="w-full p-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g., Tomato Plants"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.reminders.taskType}</label>
                                    <select
                                        value={formData.taskType}
                                        onChange={(e) => setFormData({ ...formData, taskType: e.target.value as Reminder['taskType'] })}
                                        className="w-full p-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    >
                                        <option value="watering">{t.reminders.watering}</option>
                                        <option value="fertilizing">{t.reminders.fertilizing}</option>
                                        <option value="pruning">{t.reminders.pruning}</option>
                                        <option value="other">{t.reminders.other}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.reminders.frequency}</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                        className="w-full p-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    >
                                        <option value="daily">{t.reminders.daily}</option>
                                        <option value="weekly">{t.reminders.weekly}</option>
                                        <option value="biweekly">{t.reminders.biweekly}</option>
                                        <option value="monthly">{t.reminders.monthly}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.reminders.notes}</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        rows={3}
                                        placeholder="Add any additional notes..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-input rounded-xl font-medium hover:bg-muted transition-colors"
                                    >
                                        {t.reminders.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        {editingReminder ? t.reminders.update : t.reminders.create}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
