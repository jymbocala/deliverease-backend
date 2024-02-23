import LocationModel from "../models/location.js";

// Create a new location
export const createLocation = async (req, res) => {
  const location = new LocationModel(req.body);
  try {
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await LocationModel.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a location by ID
export const getLocation = async (req, res) => {
  try {
    const location = await LocationModel.findById(req.params.id);
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
    const location = await LocationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a location by ID
export const deleteLocation = async (req, res) => {
  try {
    const location = await LocationModel.findByIdAndDelete(req.params.id);
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
