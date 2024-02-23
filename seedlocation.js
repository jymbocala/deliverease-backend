import mongoose from 'mongoose';
import LocationModel from "./models/location.js";
import {closeConnection} from "./db.js";
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI;

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
    }
]

mongoose.connect(DB_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB Atlas');
        await LocationModel.deleteMany();
        console.log("Deleted all locations");
        const createdLocations = await LocationModel.insertMany(locations);
        console.log("Created locations", createdLocations);
        closeConnection();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });


