const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        plantId: {
            type: Number, // Trefle ID is usually a number
            required: true,
        },
        commonName: {
            type: String,
            required: true,
        },
        scientificName: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
