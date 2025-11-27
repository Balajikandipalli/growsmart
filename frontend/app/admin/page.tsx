'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Server, Database, Activity, Users, Settings } from 'lucide-react';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user || !user.isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-primary font-medium">Loading admin panel...</div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Backend Status',
            value: 'Online',
            icon: Server,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Database',
            value: 'Connected',
            icon: Database,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Trefle API',
            value: 'Active',
            icon: Activity,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Admin Panel</h1>
                </div>
                <p className="text-muted-foreground">
                    System overview and management controls.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-2xl border shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card p-8 rounded-2xl border shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">User Management</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Manage registered users, roles, and permissions.
                    </p>
                    <button className="text-sm font-medium text-primary hover:underline">
                        View all users →
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card p-8 rounded-2xl border shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">System Settings</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Configure application settings and API keys.
                    </p>
                    <button className="text-sm font-medium text-primary hover:underline">
                        Manage settings →
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
