import express from 'express';
import {
    createLocation,
    getLocation,
    updateLocation,
    deleteLocation,
    getAllLocations
} from '../controllers/locationController.js';

const router = express.Router();

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