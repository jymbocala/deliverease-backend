// Import the mongoose module
import mongoose from "mongoose";

// Define the schema for the Location model
const locationSchema = new mongoose.Schema({
    // The name field is required and must be unique
    name: {
        type: String,
        required: true,
        unique: true,
    },
    // The address field is required
    address: {
        type: String,
        required: true,
    },
    // The dockNumber field is optional
    dockNumber: {
        type: String,
        required: false,
    },
    // The dockHours field is optional
    dockHours: {
        type: String,
        required: false,
    },
    // The parking field is optional
    parking: {
        type: String,
        required: false,
    },
    // The contactName field is optional
    contactName: {
        type: String,
        required: false,
    },
    // The contactNumber field is optional
    contactNumber: {
        type: Number,
        required: false,
    },
    // The notes field is optional
    notes: {
        type: String,
        required: false,
    },
    // The createdBy field is a reference to the User model
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    // dateCreated field is automatically populated with the current date and time
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    // imageURL field is optional string
    imageURL: {
        type: String,
        required: false,
    },
});

// Create the Location model using the schema
const LocationModel = mongoose.model('Location', locationSchema);

// Export the Location model
export default LocationModel;