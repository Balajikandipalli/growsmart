'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyForecast {
    date: number;
    temp_day: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    weather: string;
    description: string;
    icon: string;
    rain: number;
}

interface ForecastData {
    location: string;
    daily: DailyForecast[];
}

interface WeatherForecastProps {
    location: string;
}

export default function WeatherForecast({ location }: WeatherForecastProps) {
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForecast();
    }, [location]);

    const fetchForecast = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/weather/forecast/${location}`);
            if (!res.ok) throw new Error('Failed to fetch forecast');
            const data = await res.json();
            setForecast(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (weatherType: string) => {
        switch (weatherType?.toLowerCase()) {
            case 'clear':
                return <Sun className="w-8 h-8 text-yellow-500" />;
            case 'rain':
            case 'drizzle':
                return <CloudRain className="w-8 h-8 text-blue-500" />;
            default:
                return <Cloud className="w-8 h-8 text-gray-400" />;
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-20 bg-muted rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!forecast) return null;

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">7-Day Forecast - {forecast.location}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.daily.map((day, index) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors"
                    >
                        <p className="text-sm font-medium mb-2">{formatDate(day.date)}</p>
                        <div className="flex justify-center mb-2">
                            {getWeatherIcon(day.weather)}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize mb-2">{day.description}</p>
                        <div className="space-y-1">
                            <p className="text-lg font-bold">{Math.round(day.temp_day)}°</p>
                            <p className="text-xs text-muted-foreground">
                                {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°
                            </p>
                            <p className="text-xs text-blue-500">{day.humidity}%</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
