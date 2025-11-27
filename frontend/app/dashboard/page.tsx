'use client';

import { useState } from 'react';
import WeatherCard from '@/components/WeatherCard';
import WeatherForecast from '@/components/WeatherForecast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Sprout, Bell, ShoppingBag, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [location, setLocation] = useState('Hyderabad');
    const [inputLocation, setInputLocation] = useState('');

    const handleLocationChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputLocation.trim()) {
            setLocation(inputLocation.trim());
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h2 className="text-2xl font-bold mb-4">{t.auth.loginTitle}</h2>
                <p className="text-muted-foreground mb-6">{t.auth.loginSubtitle}</p>
                <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    {t.nav.login}
                </Link>
            </div>
        );
    }

    const quickActions = [
        {
            title: t.dashboard.searchPlants,
            description: t.dashboard.searchPlantsDesc,
            icon: Sprout,
            href: '/search',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: t.dashboard.myFavorites,
            description: t.dashboard.myFavoritesDesc,
            icon: Sprout,
            href: '/favorites',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            title: t.dashboard.reminders,
            description: t.dashboard.remindersDesc,
            icon: Bell,
            href: '/reminders',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: t.dashboard.shop,
            description: t.dashboard.shopDesc,
            icon: ShoppingBag,
            href: '/shop',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t.dashboard.welcome}, {user.name}!</h1>
                    <p className="text-muted-foreground">
                        {t.dashboard.subtitle}
                    </p>
                </div>

                <form onSubmit={handleLocationChange} className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t.dashboard.enterLocation}
                            className="pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={inputLocation}
                            onChange={(e) => setInputLocation(e.target.value)}
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        {t.dashboard.updateLocation}
                    </button>
                </form>
            </div>

            {/* Weather Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <WeatherCard location={location} />
                </div>
                <div className="lg:col-span-2">
                    <WeatherForecast location={location} />
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold mb-4">{t.dashboard.quickActions}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={action.href}
                                className="block bg-card border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center mb-4`}>
                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">{t.dashboard.comingSoon}</h3>
                <p className="text-muted-foreground mb-4">
                    {t.dashboard.comingSoonDesc}
                </p>
            </div>
        </div>
    );
}
