const axios = require('axios');

const TREFLE_API_URL = 'https://trefle.io/api/v1';
const TOKEN = process.env.TREFLE_API_TOKEN || 'usr-8n8gFBeqObcCflpoHwIC48RqBviI4yLrpNWoLWb0AvY';

const searchPlants = async (query, page = 1) => {
    try {
        const response = await axios.get(`${TREFLE_API_URL}/plants/search`, {
            params: {
                token: TOKEN,
                q: query,
                page,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Trefle Search Error:', error.message);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        throw new Error('Failed to search plants');
    }
};

const getPlantDetails = async (id) => {
    try {
        console.log(`Fetching details for plant ID: ${id}`);
        const response = await axios.get(`${TREFLE_API_URL}/plants/${id}`, {
            params: {
                token: TOKEN,
            },
        });
        console.log('Trefle API Response:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Trefle Details Error:', error.message);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        throw new Error('Failed to get plant details');
    }
};

const getAllPlants = async (page = 1) => {
    try {
        const response = await axios.get(`${TREFLE_API_URL}/plants`, {
            params: {
                token: TOKEN,
                page,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Trefle Get All Error:', error.message);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        throw new Error('Failed to fetch plants');
    }
};

module.exports = {
    searchPlants,
    getPlantDetails,
    getAllPlants,
};
