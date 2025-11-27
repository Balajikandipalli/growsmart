const weatherService = require('../services/weatherService');

// @desc    Get current weather for a location
// @route   GET /api/weather/current/:location
// @access  Public
const getCurrentWeather = async (req, res) => {
    try {
        const { location } = req.params;
        const weather = await weatherService.getCurrentWeather(location);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get 7-day weather forecast
// @route   GET /api/weather/forecast/:location
// @access  Public
const getWeatherForecast = async (req, res) => {
    try {
        const { location } = req.params;
        const forecast = await weatherService.getWeatherForecast(location);
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get climate suitability for a plant
// @route   POST /api/weather/suitability
// @access  Public
const getClimateSuitability = async (req, res) => {
    try {
        const { location, plantRequirements } = req.body;

        if (!location) {
            return res.status(400).json({ message: 'Location is required' });
        }

        const weather = await weatherService.getCurrentWeather(location);
        const suitability = weatherService.calculateClimateSuitability(weather, plantRequirements);

        res.json({
            location: weather.location,
            ...suitability,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCurrentWeather,
    getWeatherForecast,
    getClimateSuitability,
};
