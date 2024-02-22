import express from "express";
import s3Routes from "./s3_routes.js";
import cors from "cors";

const app = express()

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => res.send({ info: "DeliverEase API" }));


app.use('/s3', s3Routes);

export default app;
