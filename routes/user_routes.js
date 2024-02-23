import { Router } from 'express';
import UserModel from '../models/user.js';

const router = Router(); // Create a new router

// Routes

// Create a new user -   C
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = new UserModel({ email, password });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all users -  R 
router.get('/', async (req, res) => {
    const users = await UserModel.find();
    res.status(200).send(users);
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Update a user by ID -  U
router.patch('/:id', async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send('User updated');
    } catch (error) {
        res.status(400).send('Update failed');
    }
});

// Delete a user by ID -  D
router.delete('/:id', async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted');
    } catch (error) {
        res.status(404).send('User not found');
    }
});

export default router; // Export the router