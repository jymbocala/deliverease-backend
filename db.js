import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectToDatabase = async () => {
    try {
        const m = await mongoose.connect(process.env.DB_URI);
        console.log(
            m.connection.readyState === 1
                ? "Successfully connected to MongoDB Atlas"
                : "Error connecting to MongoDB Atlas"
        );
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
    }
};

const closeConnection = () => {
    console.log('Mongoose Disconnected');
    mongoose.connection.close(); 
};

export { connectToDatabase, closeConnection };
