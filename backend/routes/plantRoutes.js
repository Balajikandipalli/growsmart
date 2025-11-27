const express = require('express');
const router = express.Router();
const {
    searchPlants,
    getPlantDetails,
    getPlants,
    addFavorite,
    getFavorites,
    removeFavorite,
} = require('../controllers/plantController');
const { protect } = require('../middleware/auth');

router.get('/search', searchPlants);
router.get('/', getPlants);
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);
router.get('/:id', getPlantDetails);

module.exports = router;
