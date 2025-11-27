'use client';

import { useState, useEffect } from 'react';
import PlantCard from '@/components/PlantCard';
import PlantDetails from '@/components/PlantDetails';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [plants, setPlants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    // Fetch favorites to mark them
    useEffect(() => {
        if (user) {
            fetch(`${API_BASE_URL}/api/plants/favorites`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setFavorites(new Set(data.map((fav: any) => fav.plantId)));
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/plants/search?q=${query}`);
            const data = await res.json();
            setPlants(data.data || []);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetails = async (id: number) => {
        setDetailsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/plants/${id}`);
            const data = await res.json();
            setSelectedPlant(data.data);
        } catch (error) {
            console.error('Failed to fetch details', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleFavorite = async (plant: any) => {
        if (!user) {
            alert('Please login to add favorites');
            return;
        }

        if (favorites.has(plant.id)) {
            alert('Already in favorites');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/plants/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    plantId: plant.id,
                    commonName: plant.common_name || 'Unknown',
                    scientificName: plant.scientific_name,
                    imageUrl: plant.image_url,
                }),
            });

            if (res.ok) {
                setFavorites((prev) => new Set(prev).add(plant.id));
            } else {
                alert('Failed to add favorite');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    {t.tutorials.findPlants}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t.home.smartSearchDesc}
                </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder={t.search.placeholder}
                        className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm border border-input rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg hover:shadow-md"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        suppressHydrationWarning
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 bg-primary text-primary-foreground px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
                        suppressHydrationWarning
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.search.button}
                    </button>
                </div>

            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {plants.map((plant, index) => (
                        <motion.div
                            key={plant.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            layout
                        >
                            <PlantCard
                                plant={plant}
                                onDetails={handleDetails}
                                onFavorite={handleFavorite}
                                isFavorite={favorites.has(plant.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {plants.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t.search.noResults}</h3>
                </div>
            )}

            {selectedPlant && (
                <PlantDetails plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
            )}
        </div>
    );
}
