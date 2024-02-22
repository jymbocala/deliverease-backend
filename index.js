import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
        res.send('Hello World');
});

app.use('/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });