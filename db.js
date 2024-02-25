import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Function to connect to the MongoDB database
const connectToDatabase = async () => {
    try {
        // Attempt to connect to the database
        const m = await mongoose.connect(process.env.DB_URI);
        
        // Log the connection status
        console.log(
            m.connection.readyState === 1
                ? "Successfully connected to MongoDB Atlas"
                : "Error connecting to MongoDB Atlas"
        );
    } catch (error) {
        // Log any errors that occur during connection
        console.error("Error connecting to MongoDB Atlas:", error.message);
    }
};

// Function to close the MongoDB connection
const closeConnection = () => {
    console.log('Mongoose Disconnected');
    mongoose.connection.close(); 
};

// Export the connectToDatabase and closeConnection functions
export { connectToDatabase, closeConnection };