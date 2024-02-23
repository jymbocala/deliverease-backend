import mongoose from 'mongoose';
import UserModel from "./models/user.js";
import {closeConnection} from "./db.js";
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI;

const users = [
        {
                email: "deliverease1@gmail.com",
                password: "password1",
        },
        {
                email: "deliverease2@gmail.com",
                password: "password2",
        },
];

mongoose.connect(DB_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB Atlas');
        await UserModel.deleteMany();
        console.log("Deleted all users");
        const createdUsers = await UserModel.insertMany(users);
        console.log("Created users", createdUsers);
        closeConnection();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });