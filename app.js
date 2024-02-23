import express from "express";
import s3Routes from "./routes/s3_routes.js";
import cors from "cors";

const app = express()

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => res.send({ info: "DeliverEase API" }));

// Mount the S3 routes with the /s3 prefix on the URL path
app.use('/s3', s3Routes);

export default app;
