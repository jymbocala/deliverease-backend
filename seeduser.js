import mongoose from 'mongoose';
import UserModel from "./models/user.js";
import {closeConnection} from "./db.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 

dotenv.config(); 

const DB_URI = process.env.DB_URI; 

// Array of user objects to seed the database with
const users = [
        {
                email: "deliverease1@gmail.com",
                password: "password1"
        },
        {
                email: "deliverease2@gmail.com",
                password: "password2"
        },
        {
                email: "deliverease3@gmail.com",
                password: "password3"
        },
        {
                email: "admin@gmail.com",
                password: "adminpassword",
                role: "admin"
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
                        const newUser = new UserModel({ email: user.email, password: hashedPassword, role: user.role }); // Create a new user with the hashed password and role field
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