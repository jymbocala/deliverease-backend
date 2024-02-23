import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // Import the authMiddleware
import {
    createLocation,
    getAllLocations,
    getLocation,
    updateLocation,
    deleteLocation
} from '../controllers/locationController.js'; // Import the locationController

const router = express.Router();

// Apply the authMiddleware to all routes in this router
router.use(authMiddleware);

// Route to create a new location
router.post('/new', createLocation);

// Route to get all locations
router.get('/', getAllLocations);

// Route to get a location by ID
router.get('/:id', getLocation);

// Route to update a location by ID
router.put('/:id', updateLocation);

// Route to delete a location by ID
router.delete('/:id', deleteLocation);

export default router;
