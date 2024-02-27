import express from 'express';
import UserRoutes from './routes/user_routes.js';
import LocationRoutes from './routes/locations_routes.js';
import s3Routes from "./routes/s3_routes.js";
import cors from 'cors';
import { getGoogleMapsApiKey } from './googleMaps.js';

// Initialize express application
const app = express();

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Use express.json middleware to parse JSON request bodies
app.use(express.json());

// Define a GET route for the root path ("/") of the API
app.get("/", (req, res) => res.send({ info: "DeliverEase API" }));

// Set up a route to serve the Google Maps API key
app.get("/api/maps/api_key", (req, res) => {
    try {
        const apiKey = getGoogleMapsApiKey();
        res.json({ api_key: apiKey });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use the UserRoutes for any requests to /users
app.use('/users', UserRoutes);

// Use the LocationRoutes for any requests to /locations
app.use('/locations', LocationRoutes);

// Use the s3Routes for any requests to /s3
app.use('/s3', s3Routes);

// Export the express application
export default app;
