'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
    location: string;
    country: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    weather: string;
    description: string;
    wind_speed: number;
    icon: string;
}

interface WeatherCardProps {
    location: string;
}

export default function WeatherCard({ location }: WeatherCardProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWeather();
    }, [location]);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/weather/current/${location}`);
            if (!res.ok) throw new Error('Failed to fetch weather');
            const data = await res.json();
            setWeather(data);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherGradient = (weatherType: string) => {
        switch (weatherType?.toLowerCase()) {
            case 'clear':
                return 'from-orange-400 to-amber-300 text-white';
            case 'rain':
            case 'drizzle':
                return 'from-blue-600 to-cyan-500 text-white';
            case 'clouds':
                return 'from-slate-500 to-gray-400 text-white';
            case 'thunderstorm':
                return 'from-indigo-900 to-purple-800 text-white';
            case 'snow':
                return 'from-blue-100 to-white text-slate-800';
            default:
                return 'from-emerald-500 to-teal-400 text-white';
        }
    };

    const getWeatherIcon = (weatherType: string) => {
        const iconClass = "w-12 h-12 drop-shadow-md";
        switch (weatherType?.toLowerCase()) {
            case 'clear':
                return <Sun className={`${iconClass} text-yellow-100`} />;
            case 'rain':
            case 'drizzle':
                return <CloudRain className={`${iconClass} text-blue-100`} />;
            case 'clouds':
                return <Cloud className={`${iconClass} text-gray-100`} />;
            default:
                return <Cloud className={`${iconClass} text-white`} />;
        }
    };

    if (loading) {
        return (
            <div className="bg-card border rounded-2xl p-6 shadow-sm h-full">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-muted rounded"></div>
                        <div className="h-12 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-card border rounded-2xl p-6 shadow-sm h-full flex items-center justify-center">
                <p className="text-destructive">Unable to load weather data</p>
            </div>
        );
    }

    const gradientClass = getWeatherGradient(weather.weather);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${gradientClass} rounded-3xl p-8 shadow-xl relative overflow-hidden h-full`}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            {weather.location}, {weather.country}
                        </h3>
                        <p className="opacity-90 capitalize font-medium">{weather.description}</p>
                    </div>
                    {getWeatherIcon(weather.weather)}
                </div>

                <div className="mb-8">
                    <div className="text-6xl font-bold tracking-tighter">
                        {Math.round(weather.temperature)}°
                    </div>
                    <p className="opacity-90 font-medium mt-1">Feels like {Math.round(weather.feels_like)}°</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-center">
                        <Droplets className="w-5 h-5 mx-auto mb-1 opacity-80" />
                        <p className="text-xs opacity-70">Humidity</p>
                        <p className="font-bold">{weather.humidity}%</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-center">
                        <Wind className="w-5 h-5 mx-auto mb-1 opacity-80" />
                        <p className="text-xs opacity-70">Wind</p>
                        <p className="font-bold">{Math.round(weather.wind_speed)}m/s</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-center">
                        <Gauge className="w-5 h-5 mx-auto mb-1 opacity-80" />
                        <p className="text-xs opacity-70">Pressure</p>
                        <p className="font-bold">{weather.pressure}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

