// Import the mongoose module
import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // The email field is required and must be unique
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // The password field is required
    password: {
        type: String,
        required: true,
    },
    // The role field defaults to "user" if not specified
    role: {
        type: String,
        default: "user", // Set default value to "user"
    },
});

// Create the User model using the schema
const UserModel = mongoose.model('User', userSchema);

// Export the User model
export default UserModel;