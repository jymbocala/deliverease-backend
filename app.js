import express from "express";
import UserRoutes from "./routes/user_routes.js";
import LocationRoutes from "./routes/locations_routes.js";
import s3Routes from "./routes/s3_routes.js";
import authRoutes from "./routes/auth.js";
import passwordResetRoutes from "./routes/passwordReset_routes.js";
import cors from "cors";
import { getGoogleMapsApiKey } from "./googleMaps.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize express application
const app = express();

// Use CORS middleware to allow requests from specific origin
app.use(
  cors({
    origin: ["http://localhost:5173", "https://deliverease-api.onrender.com", "https://deliverease.live", "https://deliverease2.netlify.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow sending cookies across origins
  })
);

// Use express.json middleware to parse JSON request bodies
app.use(express.json());

// Define a GET route for the root path ("/") of the API
app.get("/", (req, res) => res.send({ info: "DeliverEase API" }));

// Set up a route to serve the Google Maps API key
app.get("/api/maps/api_key", (req, res) => {
  try {
    // Get the API key
    const apiKey = getGoogleMapsApiKey();
    // Send the API key in the response
    res.json({ api_key: apiKey });
  } catch (error) {
    // If there's an error, send it in the response
    res.status(500).json({ error: error.message });
  }
});

// Use the UserRoutes for any requests to /users
app.use("/users", UserRoutes);

// Use the LocationRoutes for any requests to /locations
app.use("/locations", LocationRoutes);

// Use the s3Routes for any requests to /s3
app.use("/s3", s3Routes);

// Use the authRoutes for any requests to /forgot-password
app.use("/forgot-password", authRoutes);

// Use the passwordResetRoutes for any requests to /reset-password
app.use("/", passwordResetRoutes);

// Export the express application
export default app;
