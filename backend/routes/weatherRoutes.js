const express = require('express');
const router = express.Router();
const {
    getCurrentWeather,
    getWeatherForecast,
    getClimateSuitability,
} = require('../controllers/weatherController');

router.get('/current/:location', getCurrentWeather);
router.get('/forecast/:location', getWeatherForecast);
router.post('/suitability', getClimateSuitability);

module.exports = router;
