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
import authMiddleware from '../middleware/authMiddleware.js'; // Import the authMiddleware

const router = express.Router();

// Route to create a new user
router.post('/new', createUser);

// Route to log in
router.post('/login', loginUser);

// Route to log out (optional)
router.post('/logout', authMiddleware, logoutUser); // Apply authMiddleware to the logout route

// Route to get all users
router.get('/', authMiddleware, getAllUsers); // Apply authMiddleware to the getAllUsers route

// Route to get a user by ID
router.get('/:id', authMiddleware, getUser); // Apply authMiddleware to the getUser route

// Route to update a user by ID
router.put('/:id', authMiddleware, updateUser); // Apply authMiddleware to the updateUser route

// Route to delete a user by ID
router.delete('/:id', authMiddleware, deleteUser); // Apply authMiddleware to the deleteUser route

export default router;
