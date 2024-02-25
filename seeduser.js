import mongoose from 'mongoose';
import UserModel from "./models/user.js";
import {closeConnection} from "./db.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import bcrypt from 'bcrypt'; // Import bcrypt

dotenv.config(); // Load environment variables from .env file

const DB_URI = process.env.DB_URI; // Get the MongoDB URI from the environment variables

// Array of user objects to seed the database with
const users = [
        {
                email: "deliverease1@gmail.com",
                password: "password1",
                isAdmin: false,
        },
        {
                email: "deliverease2@gmail.com",
                password: "password2",
                isAdmin: false,
        },
        {
                email: "deliverease3@gmail.com",
                password: "password3",
                isAdmin: false,
        },
        {
                email: "admin@gmail.com",
                password: "adminpassword",
                isAdmin: true,
        },
];

// Connect to the MongoDB database
mongoose.connect(DB_URI)
        .then(async () => {
                console.log('Successfully connected to MongoDB Atlas'); // Log a message when the connection is successful

                // Delete all existing users in the database
                await UserModel.deleteMany();
                console.log("Deleted all users"); // Log a message when all users have been deleted

                // Hash passwords and insert the users from the users array into the database
                const createdUsers = await Promise.all(users.map(async user => {
                        const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
                        const newUser = new UserModel({ email: user.email, password: hashedPassword, isAdmin: user.isAdmin }); // Create a new user with the hashed password and isAdmin field
                        return newUser.save(); // Save the new user to the database
                }));

                // Generate JWT for each user and log it
                createdUsers.forEach(user => {
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        console.log(`Created user: ${user.email}, JWT: ${token}`);
                });

                // Close the MongoDB connection
                closeConnection();
        })
        .catch((error) => {
                // Log any errors that occur during connection
                console.error('Error connecting to MongoDB Atlas:', error.message);
        });