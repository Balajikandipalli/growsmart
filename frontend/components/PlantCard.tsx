'use client';

import React from 'react';
import { Heart, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslate } from '@/hooks/useTranslate';

interface PlantProps {
    plant: {
        id: number;
        common_name: string;
        scientific_name: string;
        image_url: string;
    };
    onDetails: (id: number) => void;
    onFavorite?: (plant: any) => void;
    isFavorite?: boolean;
}

const PlantCard: React.FC<PlantProps> = ({ plant, onDetails, onFavorite, isFavorite }) => {
    const soilTypes = ['Red Soil', 'Black Soil', 'Loamy Soil', 'Sandy Soil', 'Clay Soil'];
    const soilType = soilTypes[plant.id % 5];

    // Translate plant name and soil type
    const { translatedText: translatedName } = useTranslate(plant.common_name || 'Unknown Plant');
    const { translatedText: translatedSoilType } = useTranslate(soilType);
    const { translatedText: translatedSoilLabel } = useTranslate('Soil');
    const { translatedText: translatedDetailsBtn } = useTranslate('Details');

    return (
        <div className="group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={plant.image_url || 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&q=80'}
                    alt={plant.common_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={() => onDetails(plant.id)}
                        className="flex-1 bg-white/90 backdrop-blur-sm text-foreground py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        <Info className="w-4 h-4" />
                        {translatedDetailsBtn}
                    </button>
                    {onFavorite && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onFavorite(plant);
                            }}
                            className={cn(
                                "p-2 rounded-lg backdrop-blur-sm transition-colors",
                                isFavorite
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-white/90 text-foreground hover:bg-white"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground truncate mb-1" title={plant.common_name}>
                    {translatedName}
                </h3>
                <p className="text-sm text-muted-foreground italic truncate mb-3">
                    {plant.scientific_name}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-100 dark:bg-stone-900/30 dark:text-stone-400 px-2 py-1 rounded-md w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
                    {translatedSoilLabel}: {translatedSoilType}
                </div>
            </div>


        </div>
    );
};

export default PlantCard;
