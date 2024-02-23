import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    dockNumber: {
        type: Number,
        required: false,
    },
    dockHours: {
        type: String,
        required: false,
    },
    parking: {
        type: String,
        required: false,
    },
    contactName: {
        type: String,
        required: false,
    },
    contactNumber: {
        type: Number,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
});

const LocationModel = mongoose.model('Location', locationSchema);

export default LocationModel;
