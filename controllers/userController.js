import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";

// Create a new user
export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with the provided role
    const newUser = new UserModel({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
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
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Retrieve all users
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID (only accessible by admins)
export const updateUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Update the user
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID (only accessible by admins)
export const deleteUser = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to access this resource",
      });
    }

    // Delete the user
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
