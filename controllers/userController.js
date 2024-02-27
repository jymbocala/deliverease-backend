import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import logger from "../utils/logger.js";

// Create a new user
export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // Log error message
      logger.error(`User already exists with email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with the provided role
    const newUser = new UserModel({ email, password: hashedPassword, role });
    await newUser.save();

    // Log success message
    logger.info(`User created: ${newUser}`);

    res.status(201).json(newUser);
  } catch (error) {
    // Log error message
    logger.error(`Error creating user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Log error message
      logger.error(`User not found with email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log error message
      logger.error(`Invalid password for user with email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Log success message
    logger.info(`User logged in: ${email}`);

    // Include the user's ID in the response
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    // Log error message
    logger.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Logout user (optional)
export const logoutUser = async (req, res) => {
  // Implementation can be added as needed
};

// Get all users (only accessible by admins)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
      // Log error message
      logger.error(
        `Unauthorized access: ${req.user.email} attempted to access all users`
      );
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Retrieve all users
    const users = await UserModel.find();

    // Log success message
    logger.info("All users retrieved");

    res.json(users);
  } catch (error) {
    // Log error message
    logger.error(`Error retrieving all users: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      // Log error message
      logger.error(`User not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Log success message
    logger.info(`User retrieved: ${user.email}`);

    res.json(user);
  } catch (error) {
    // Log error message
    logger.error(`Error retrieving user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID (accessible by the user themselves or admins)
export const updateUser = async (req, res) => {
  try {
    const userToUpdate = await UserModel.findById(req.params.id);
    if (!userToUpdate) {
      // Log error message
      logger.error(`User not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user making the request is the same as the user being updated or is an admin
    if (req.user._id.toString() !== userToUpdate._id.toString() && req.user.role !== "admin") {
      // Log error message
      logger.error(
        `Unauthorized access: ${req.user.email} attempted to update user with ID: ${req.params.id}`
      );
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Check the current password
    const { currentPassword, password } = req.body;
    const isPasswordValid = await bcrypt.compare(currentPassword, userToUpdate.password);
    if (!isPasswordValid) {
      // Log error message
      logger.error(`Invalid current password for user with ID: ${req.params.id}`);
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { ...req.body, password: hashedPassword }, {
      new: true,
    });

    // Log success message
    logger.info(`User updated: ${updatedUser.email}`);

    res.json(updatedUser);
  } catch (error) {
    // Log error message
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID (only accessible by admins)
export const deleteUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
      // Log error message
      logger.error(
        `Unauthorized access: ${req.user.email} attempted to delete user with ID: ${req.params.id}`
      );
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Delete the user
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      // Log error message
      logger.error(`User not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Log success message
    logger.info(`User deleted: ${user.email}`);

    res.json({ message: "User deleted" });
  } catch (error) {
    // Log error message
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
