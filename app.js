import express from 'express';
import UserRoutes from './routes/user_routes.js';
import LocationRoutes from './routes/locations_routes.js';
import s3Routes from "./routes/s3_routes.js";
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send({ info: "DeliverEase API" }));

app.use('/users', UserRoutes);

app.use('/locations', LocationRoutes);

app.use('/s3', s3Routes);

export default app;
