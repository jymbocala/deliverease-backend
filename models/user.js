import mongoose from "mongoose";

// Define the schema for a user
const userSchema = new mongoose.Schema({
    // User's email - it's required and must be unique
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // User's password - it's required
    password: {
        type: String,
        required: true,
    },
    // User's role - it's optional and defaults to "user"
    role: {
        type: String,
        default: "user",
    },
    // Token for resetting password - it's optional
    resetPasswordToken: {
        type: String,
    },
    // Expiry date for the reset password token - it's optional
    resetPasswordExpires: {
        type: Date,
    },
});

// Create a model from the user schema
const UserModel = mongoose.model('User', userSchema);

// Export the user model
export default UserModel;