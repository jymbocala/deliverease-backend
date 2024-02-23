import express from 'express';
import UserRoutes from './routes/user_routes.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
} );

app.use('/users', UserRoutes);

export default app;

