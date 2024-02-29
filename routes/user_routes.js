import express from 'express';
import {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route to create a new user
// POST request to /new
router.post('/new', createUser);

// Route to log in
// POST request to /login
router.post('/login', loginUser);

// Route to log out (optional)
// POST request to /logout
// authMiddleware is used to verify the user's authentication status
router.post('/logout', authMiddleware, logoutUser);

// Route to get all users
// GET request to /
// authMiddleware is used to verify the user's authentication status
router.get('/', authMiddleware, getAllUsers);

// Route to get a user by ID
// GET request to /:id
// authMiddleware is used to verify the user's authentication status
router.get('/:id', authMiddleware, getUser);

// Route to update a user by ID
// PUT request to /:id
// authMiddleware is used to verify the user's authentication status
router.put('/:id', authMiddleware, updateUser);

// Route to delete a user by ID
// DELETE request to /:id
// authMiddleware is used to verify the user's authentication status
router.delete('/:id', authMiddleware, deleteUser);

export default router;
