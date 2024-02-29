import LocationModel from "../models/location.js"; 
import logger from "../utils/logger.js"; // Logger for logging information and errors

// Create a new location
export const createLocation = async (req, res) => {
  // Destructure location details from request body
  const {
    name,
    address,
    dockNumber,
    dockHours,
    parking,
    contactName,
    contactNumber,
    notes,
    dateCreated,
    imageURL,
  } = req.body;

  // Check if req.user is defined, if not, return an error
  if (!req.user) {
    logger.error("No user associated with request");
    return res.status(400).json({ message: "No user associated with request" });
  }

  try {
    // Retrieve the user ID from the request
    const userId = req.user._id;

    // Create a new location with createdBy field populated
    const location = new LocationModel({
      name,
      address,
      createdBy: userId,
      dockNumber,
      dockHours,
      parking,
      contactName,
      contactNumber,
      notes,
      dateCreated,
      imageURL,
    });

    // Save the location to the database
    await location.save();

    // Find the created location again to populate createdBy field
    const createdLocation = await LocationModel.findById(location._id).populate(
      "createdBy"
    );

    // Log success message
    logger.info(`Location created: ${createdLocation}`);

    // Send the response
    res.status(201).json(createdLocation);
  } catch (error) {
    // Log error message
    logger.error(`Error creating location: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    // Retrieve all locations and populate createdBy field with user details
    const locations = await LocationModel.find().populate("createdBy", "email");

    // Log success message
    logger.info("All locations retrieved");

    // Send the response
    res.json(locations);
  } catch (error) {
    // Log error message
    logger.error(`Error retrieving all locations: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get locations created by the current user
export const getUserLocations = async (req, res) => {
  try {
    // Retrieve locations created by the current user
    const locations = await LocationModel.find({ createdBy: req.user._id });

    // Log success message
    logger.info("User's locations retrieved");

    // Send the response
    res.json(locations);
  } catch (error) {
    // Log error message
    logger.error(`Error retrieving user's locations: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get a location by ID
export const getLocation = async (req, res) => {
  // Check if req.user is defined, if not, return an error
  if (!req.user) {
    logger.error("No user associated with request");
    return res.status(400).json({ message: "No user associated with request" });
  }

  try {
    // Find the location by ID and ensure it's created by the logged-in user
    const location = await LocationModel.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!location)
      return res.status(404).json({ message: "Location not found" });

    // Log success message
    logger.info(`Location retrieved: ${location}`);

    // Send the response
    res.json(location);
  } catch (error) {
    // Log error message
    logger.error(`Error retrieving location: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update a location by ID
export const updateLocation = async (req, res) => {
  // Check if req.user is defined, if not, return an error
  if (!req.user) {
    logger.error("No user associated with request");
    return res.status(400).json({ message: "No user associated with request" });
  }

  try {
    // Find the location by ID and ensure it's owned by the logged-in user
    let location = await LocationModel.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!location)
      return res.status(404).json({ message: "Location not found" });

    // Update the location
    location = await LocationModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Log success message
    logger.info(`Location updated: ${location}`);

    // Send the response
    res.json(location);
  } catch (error) {
    // Log error message
    logger.error(`Error updating location: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Delete a location by ID
export const deleteLocation = async (req, res) => {
  // Check if req.user is defined, if not, return an error
  if (!req.user) {
    logger.error("No user associated with request");
    return res.status(400).json({ message: "No user associated with request" });
  }

  try {
    // Find the location by ID and ensure it's owned by the logged-in user
    const location = await LocationModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!location)
      return res.status(404).json({ message: "Location not found" });

    // Log success message
    logger.info(`Location deleted: ${location}`);

    // Send the response
    res.json({ message: "Location deleted" });
  } catch (error) {
    // Log error message
    logger.error(`Error deleting location: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
