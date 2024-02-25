import mongoose from 'mongoose';
import LocationModel from "./models/location.js";
import {closeConnection} from "./db.js";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const DB_URI = process.env.DB_URI; // Get the MongoDB URI from the environment variables

// Array of location objects to seed the database with
const locations = [
    {
        name: 'Amazon',
        address: '1234 Amazon St',
        dockNumber: 1,
        dockHours: '8am-5pm',
        parking: 'Yes',
        contactName: 'John Doe',
        contactNumber: 1234567890,
        notes: 'Call before delivery'
    },
    {
        name: 'Walmart',
        address: '5678 Walmart St',
        dockNumber: 2,
        dockHours: '9am-6pm',
        parking: 'No',
        contactName: 'Jane Doe',
        contactNumber: 1234567890,
        notes: 'Call before delivery'
    },
    {
        name: 'Target',
        address: '910 Target St',
        dockNumber: 3,
        dockHours: '10am-7pm',
        parking: 'Yes',
        contactName: 'John Smith',
        contactNumber: 1234567890,
        notes: 'Call before delivery'
    },
    {
        name: 'Costco',
        address: '1112 Costco St',
        dockNumber: 4,
        dockHours: '11am-8pm',
        parking: 'No',
        contactName: 'Jane Smith',
        contactNumber: 1234567890,
        notes: 'Call before delivery'
    },
]

// Connect to the MongoDB database
mongoose.connect(DB_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB Atlas'); // Log a message when the connection is successful

        // Delete all existing locations in the database
        await LocationModel.deleteMany();
        console.log("Deleted all locations"); // Log a message when all locations have been deleted

        // Insert the locations from the locations array into the database
        const createdLocations = await LocationModel.insertMany(locations);
        console.log("Created locations", createdLocations); // Log the locations that were created

        // Close the MongoDB connection
        closeConnection();
    })
    .catch((error) => {
        // Log any errors that occur during connection
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });