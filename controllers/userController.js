import User from '../models/userModel.js';

// Create a new user
exports.createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
};

// Get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
};

// Update a user
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
};

// Delete a user
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
};