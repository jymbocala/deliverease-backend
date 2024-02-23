// Import the Location model
import LocationModel from "../models/location.js";

// Create a new location
export const createLocation = async (req, res) => {
  const { name, address } = req.body;

  try {
    // Retrieve the user ID from the request
    const userId = req.user._id;

    // Create a new location with createdBy field populated
    const location = new LocationModel({ name, address, createdBy: userId });
    
    // Save the location to the database
    await location.save();

    // Find the created location again to populate createdBy field
    const createdLocation = await LocationModel.findById(location._id).populate('createdBy');

    // Send the response
    res.status(201).json(createdLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    // Retrieve all locations and populate createdBy field with user details
    const locations = await LocationModel.find().populate("createdBy", "email");
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a location by ID
export const getLocation = async (req, res) => {
  try {
    // Find the location by ID and ensure it's owned by the logged-in user
    const location = await LocationModel.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a location by ID
export const updateLocation = async (req, res) => {
  try {
    // Find the location by ID and ensure it's owned by the logged-in user
    let location = await LocationModel.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!location)
      return res.status(404).json({ message: "Location not found" });

    // Update the location
    location = await LocationModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a location by ID
export const deleteLocation = async (req, res) => {
  try {
    // Find the location by ID and ensure it's owned by the logged-in user
    const location = await LocationModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
