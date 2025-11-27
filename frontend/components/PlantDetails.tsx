'use client';

import React from 'react';
import { X, Sprout, Calendar, BookOpen, Sun, Droplets, Thermometer, Ruler, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslate } from '@/hooks/useTranslate';

interface PlantDetailsProps {
    plant: any;
    onClose: () => void;
}

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, onClose }) => {
    // Translate labels
    const { translatedText: familyLabel } = useTranslate('Family');
    const { translatedText: yearLabel } = useTranslate('Year');
    const { translatedText: growthLabel } = useTranslate('Growth');
    const { translatedText: heightLabel } = useTranslate('Height');
    const { translatedText: conditionsLabel } = useTranslate('Growth Conditions');
    const { translatedText: sunlightLabel } = useTranslate('Sunlight');
    const { translatedText: waterLabel } = useTranslate('Water');
    const { translatedText: tempLabel } = useTranslate('Temperature');
    const { translatedText: descLabel } = useTranslate('Description');
    const { translatedText: toxicityLabel } = useTranslate('Toxicity Warning');

    // Translate dynamic content
    const { translatedText: translatedName } = useTranslate(plant.common_name || 'Unknown Name');
    const { translatedText: translatedFamily } = useTranslate(plant.family_common_name || plant.family || 'N/A');
    const { translatedText: translatedGrowth } = useTranslate(plant.main_species?.specifications?.growth_habit || 'N/A');
    const { translatedText: translatedSunlight } = useTranslate(plant.main_species?.growth?.light || 'N/A');
    const { translatedText: translatedWater } = useTranslate(plant.main_species?.growth?.atmospheric_humidity || 'N/A');
    const { translatedText: translatedTemp } = useTranslate(plant.main_species?.growth?.minimum_temperature?.deg_c ? `${plant.main_species.growth.minimum_temperature.deg_c}°C` : 'N/A');
    const { translatedText: translatedDesc } = useTranslate(plant.main_species?.specifications?.toxicity || 'No description available');
    const { translatedText: translatedToxicity } = useTranslate(plant.main_species?.specifications?.toxicity || 'Information not available');
    if (!plant) return null;

    const mainImage = plant.image_url || 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&q=80';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row text-zinc-900"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-muted">
                    <img
                        src={mainImage}
                        alt={plant.common_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 md:hidden text-white">
                        <h2 className="text-2xl font-bold">{translatedName}</h2>
                        <p className="text-sm opacity-90 italic">{plant.scientific_name}</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    <div className="hidden md:block mb-6">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-1">
                            {translatedName}
                        </h2>
                        <p className="text-lg text-emerald-600 italic font-medium">{plant.scientific_name}</p>
                    </div>

                    <div className="space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <Sprout className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{familyLabel}</span>
                                </div>
                                <p className="font-medium text-sm truncate text-zinc-700" title={plant.family_common_name || plant.family}>
                                    {translatedFamily}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{yearLabel}</span>
                                </div>
                                <p className="font-medium text-sm text-zinc-700">{plant.year || 'N/A'}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 text-amber-600 mb-1">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{growthLabel}</span>
                                </div>
                                <p className="font-medium text-sm text-zinc-700">{translatedGrowth}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-1">
                                    <Ruler className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{heightLabel}</span>
                                </div>
                                <p className="font-medium text-sm text-zinc-700">
                                    {plant.main_species?.specifications?.average_height?.cm ? `${plant.main_species.specifications.average_height.cm} cm` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Growth Conditions */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-900">
                                <Sun className="w-5 h-5 text-emerald-600" />
                                Growth Conditions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <Sun className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase">Light</span>
                                    </div>
                                    <p className="font-medium text-zinc-700">
                                        {plant.main_species?.growth?.light ? `Light level: ${plant.main_species.growth.light}/10` : 'No specific light data'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <Droplets className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase">Water</span>
                                    </div>
                                    <p className="font-medium text-zinc-700">
                                        {plant.main_species?.growth?.atmospheric_humidity ? `Humidity: ${plant.main_species.growth.atmospheric_humidity}/10` : 'Moderate watering'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <Thermometer className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase">Soil pH</span>
                                    </div>
                                    <p className="font-medium text-zinc-700">
                                        {plant.main_species?.growth?.ph_minimum ? `${plant.main_species.growth.ph_minimum} - ${plant.main_species.growth.ph_maximum}` : 'Neutral'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-zinc-900">
                                    <BookOpen className="w-5 h-5 text-emerald-600" />
                                    Bibliography
                                </h3>
                                <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100 h-full">
                                    {plant.bibliography || 'No bibliography available for this plant.'}
                                </p>
                            </div>

                            {plant.main_species?.specifications?.toxicity && (
                                <div>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-600">
                                        <AlertTriangle className="w-5 h-5" />
                                        Safety Information
                                    </h3>
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm">
                                        <p className="font-medium mb-1">Toxicity Warning</p>
                                        <p>This plant is reported to be toxic. Please handle with care and keep away from pets and children.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {plant.observations && (
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-zinc-900">Observations</h3>
                                <p className="text-sm text-zinc-600">{plant.observations}</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PlantDetails;
