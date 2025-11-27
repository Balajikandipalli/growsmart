'use client';

import React from 'react';
import { Trash2, Edit2, Calendar, Droplet, Scissors, Sprout, Leaf } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';
import { motion } from 'framer-motion';

interface ReminderCardProps {
    reminder: {
        _id: string;
        plantName: string;
        taskType: 'watering' | 'fertilizing' | 'pruning' | 'other';
        frequency: string;
        nextDue: string;
        notes?: string;
    };
    onEdit: (reminder: any) => void;
    onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onEdit, onDelete }) => {
    // Translate plant name and notes
    const { translatedText: translatedPlantName } = useTranslate(reminder.plantName);
    const { translatedText: translatedNotes } = useTranslate(reminder.notes || '');
    const { translatedText: translatedFrequency } = useTranslate(reminder.frequency);

    const getTaskIcon = () => {
        switch (reminder.taskType) {
            case 'watering':
                return <Droplet className="w-5 h-5" />;
            case 'fertilizing':
                return <Sprout className="w-5 h-5" />;
            case 'pruning':
                return <Scissors className="w-5 h-5" />;
            default:
                return <Leaf className="w-5 h-5" />;
        }
    };

    const getTaskColor = () => {
        switch (reminder.taskType) {
            case 'watering':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'fertilizing':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pruning':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${getTaskColor()}`}>
                        {getTaskIcon()}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{translatedPlantName}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{translatedFrequency}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(reminder)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(reminder._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(reminder.nextDue)}</span>
            </div>

            {reminder.notes && (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {translatedNotes}
                </p>
            )}
        </motion.div>
    );
};

export default ReminderCard;
