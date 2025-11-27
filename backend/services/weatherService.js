const axios = require('axios');

const WEATHER_API_URL = 'https://api.weatherapi.com/v1';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const USE_MOCK_DATA = !WEATHER_API_KEY || WEATHER_API_KEY === 'placeholder_token';

// Mock data for testing
const getMockWeatherData = (location) => ({
    location: location,
    country: 'IN',
    temperature: 28,
    feels_like: 30,
    humidity: 65,
    pressure: 1012,
    weather: 'Partly cloudy',
    description: 'Partly cloudy',
    icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    wind_speed: 3.5,
    clouds: 40,
    timestamp: Math.floor(Date.now() / 1000),
});

const getMockForecastData = (location) => ({
    location: location,
    daily: Array.from({ length: 7 }, (_, i) => ({
        date: Math.floor(Date.now() / 1000) + (i * 86400),
        temp_day: 28 + Math.random() * 4,
        temp_min: 22 + Math.random() * 3,
        temp_max: 32 + Math.random() * 3,
        humidity: 60 + Math.random() * 20,
        weather: i % 3 === 0 ? 'Sunny' : i % 3 === 1 ? 'Partly cloudy' : 'Cloudy',
        description: i % 3 === 0 ? 'Sunny' : i % 3 === 1 ? 'Partly cloudy' : 'Cloudy',
        icon: `//cdn.weatherapi.com/weather/64x64/day/${i % 3 === 0 ? '113' : i % 3 === 1 ? '116' : '119'}.png`,
        rain: Math.random() * 5,
        wind_speed: 2 + Math.random() * 3,
    })),
});

/**
 * Get current weather for a location
 * @param {string} location - City name or coordinates
 * @returns {Object} Current weather data
 */
const getCurrentWeather = async (location) => {
    // Use mock data if API key is not configured
    if (USE_MOCK_DATA) {
        console.log('⚠️  Using mock weather data (API key not configured)');
        return getMockWeatherData(location);
    }

    try {
        console.log('Fetching weather for:', location);
        console.log('API Key:', WEATHER_API_KEY ? 'Present' : 'Missing');

        const response = await axios.get(`${WEATHER_API_URL}/current.json`, {
            params: {
                key: WEATHER_API_KEY,
                q: location,
                aqi: 'no',
            },
        });

        const data = response.data;

        return {
            location: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            feels_like: data.current.feelslike_c,
            humidity: data.current.humidity,
            pressure: data.current.pressure_mb,
            weather: data.current.condition.text,
            description: data.current.condition.text,
            icon: data.current.condition.icon,
            wind_speed: data.current.wind_kph / 3.6, // Convert to m/s
            clouds: data.current.cloud,
            timestamp: new Date(data.location.localtime).getTime() / 1000,
        };
    } catch (error) {
        console.error('Error fetching current weather:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Falling back to mock data');
        return getMockWeatherData(location);
    }
};

/**
 * Get 7-day weather forecast
 * @param {string} location - City name
 * @returns {Object} Forecast data
 */
const getWeatherForecast = async (location) => {
    // Use mock data if API key is not configured
    if (USE_MOCK_DATA) {
        console.log('⚠️  Using mock forecast data (API key not configured)');
        return getMockForecastData(location);
    }

    try {
        const response = await axios.get(`${WEATHER_API_URL}/forecast.json`, {
            params: {
                key: WEATHER_API_KEY,
                q: location,
                days: 7,
                aqi: 'no',
                alerts: 'no',
            },
        });

        const data = response.data;

        return {
            location: data.location.name,
            daily: data.forecast.forecastday.map(day => ({
                date: new Date(day.date).getTime() / 1000,
                temp_day: day.day.avgtemp_c,
                temp_min: day.day.mintemp_c,
                temp_max: day.day.maxtemp_c,
                humidity: day.day.avghumidity,
                weather: day.day.condition.text,
                description: day.day.condition.text,
                icon: day.day.condition.icon,
                rain: day.day.totalprecip_mm || 0,
                wind_speed: day.day.maxwind_kph / 3.6, // Convert to m/s
            })),
        };
    } catch (error) {
        console.error('Error fetching weather forecast:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Falling back to mock data');
        return getMockForecastData(location);
    }
};

/**
 * Calculate climate suitability for a plant
 * @param {Object} weather - Current weather data
 * @param {Object} plantRequirements - Plant's climate requirements
 * @returns {Object} Suitability analysis
 */
const calculateClimateSuitability = (weather, plantRequirements = {}) => {
    const {
        temp_min = 10,
        temp_max = 35,
        humidity_min = 30,
        humidity_max = 80,
        rainfall_min = 0,
    } = plantRequirements;

    let score = 100;
    const warnings = [];
    const recommendations = [];

    // Temperature check
    if (weather.temperature < temp_min) {
        const diff = temp_min - weather.temperature;
        score -= Math.min(diff * 5, 30);
        warnings.push(`Temperature too low (${weather.temperature}°C). Plant prefers ${temp_min}°C minimum.`);
        recommendations.push('Consider indoor growing or greenhouse protection.');
    } else if (weather.temperature > temp_max) {
        const diff = weather.temperature - temp_max;
        score -= Math.min(diff * 5, 30);
        warnings.push(`Temperature too high (${weather.temperature}°C). Plant prefers ${temp_max}°C maximum.`);
        recommendations.push('Provide shade during peak hours and ensure adequate watering.');
    }

    // Humidity check
    if (weather.humidity < humidity_min) {
        const diff = humidity_min - weather.humidity;
        score -= Math.min(diff * 0.5, 20);
        warnings.push(`Humidity too low (${weather.humidity}%). Plant prefers ${humidity_min}% minimum.`);
        recommendations.push('Increase humidity with misting or humidifiers.');
    } else if (weather.humidity > humidity_max) {
        const diff = weather.humidity - humidity_max;
        score -= Math.min(diff * 0.5, 20);
        warnings.push(`Humidity too high (${weather.humidity}%). Plant prefers ${humidity_max}% maximum.`);
        recommendations.push('Ensure good air circulation to prevent fungal diseases.');
    }

    score = Math.max(0, Math.min(100, score));

    let suitability = 'Excellent';
    if (score < 40) suitability = 'Poor';
    else if (score < 60) suitability = 'Fair';
    else if (score < 80) suitability = 'Good';

    return {
        score: Math.round(score),
        suitability,
        warnings,
        recommendations,
        current_conditions: {
            temperature: weather.temperature,
            humidity: weather.humidity,
            weather: weather.weather,
        },
    };
};

module.exports = {
    getCurrentWeather,
    getWeatherForecast,
    calculateClimateSuitability,
};
