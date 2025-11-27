const trefleService = require('../services/trefleService');
const Favorite = require('../models/Favorite');

// @desc    Search plants
// @route   GET /api/plants/search
// @access  Public
const searchPlants = async (req, res) => {
    const { q, page } = req.query;
    try {
        const data = await trefleService.searchPlants(q, page);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get plant details
// @route   GET /api/plants/:id
// @access  Public
const getPlantDetails = async (req, res) => {
    try {
        const data = await trefleService.getPlantDetails(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all plants (paginated)
// @route   GET /api/plants
// @access  Public
const getPlants = async (req, res) => {
    const { page } = req.query;
    try {
        const data = await trefleService.getAllPlants(page);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Add plant to favorites
// @route   POST /api/plants/favorites
// @access  Private
const addFavorite = async (req, res) => {
    const { plantId, commonName, scientificName, imageUrl } = req.body;

    const favoriteExists = await Favorite.findOne({ user: req.user._id, plantId });

    if (favoriteExists) {
        res.status(400).json({ message: 'Plant already in favorites' });
        return;
    }

    const favorite = await Favorite.create({
        user: req.user._id,
        plantId,
        commonName,
        scientificName,
        imageUrl,
    });

    if (favorite) {
        res.status(201).json(favorite);
    } else {
        res.status(400).json({ message: 'Invalid favorite data' });
    }
};

// @desc    Get user favorites
// @route   GET /api/plants/favorites
// @access  Private
const getFavorites = async (req, res) => {
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
};

// @desc    Remove plant from favorites
// @route   DELETE /api/plants/favorites/:id
// @access  Private
const removeFavorite = async (req, res) => {
    const favorite = await Favorite.findOne({ _id: req.params.id, user: req.user._id });

    if (favorite) {
        await Favorite.deleteOne({ _id: req.params.id });
        res.json({ message: 'Favorite removed' });
    } else {
        res.status(404).json({ message: 'Favorite not found' });
    }
};

module.exports = { searchPlants, getPlantDetails, getPlants, addFavorite, getFavorites, removeFavorite };
