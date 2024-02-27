import dotenv from 'dotenv';

dotenv.config();

const getGoogleMapsApiKey = () => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Google Maps API key is not provided.');
    }
    return apiKey;
};

export { getGoogleMapsApiKey };
