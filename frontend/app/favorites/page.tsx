'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import PlantDetails from '@/components/PlantDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Sprout, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FavoritesPage() {
    const { t } = useLanguage();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/plants/favorites', {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            setFavorites(data);
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to remove this plant?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/plants/favorites/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            if (res.ok) {
                setFavorites(favorites.filter((fav) => fav._id !== id));
            }
        } catch (error) {
            console.error('Failed to remove favorite', error);
        }
    };

    const handleDetails = async (plantId: number) => {
        try {
            const res = await fetch(`http://localhost:5000/api/plants/${plantId}`);
            const data = await res.json();
            setSelectedPlant(data.data);
        } catch (error) {
            console.error('Failed to fetch details', error);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h2 className="text-2xl font-bold mb-4">{t.auth.loginTitle}</h2>
                <p className="text-muted-foreground mb-6">{t.favorites.loginRequired}</p>
                <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    {t.nav.login}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    {t.favorites.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.favorites.subtitle}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sprout className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t.favorites.emptyTitle}</h3>
                    <p className="text-muted-foreground mb-6">{t.favorites.emptyDesc}</p>
                    <Link href="/search" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                        {t.favorites.browsePlants}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {favorites.map((fav, index) => (
                            <motion.div
                                key={fav._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                layout
                                className="group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onClick={() => handleDetails(fav.plantId)}
                            >
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={fav.imageUrl || 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&q=80'}
                                        alt={fav.commonName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <button
                                        onClick={(e) => removeFavorite(fav._id, e)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-destructive hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                        title="Remove from favorites"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-foreground truncate mb-1" title={fav.commonName}>
                                        {fav.commonName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground italic truncate">
                                        {fav.scientificName}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {selectedPlant && (
                <PlantDetails plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
            )}
        </div>
    );
}
