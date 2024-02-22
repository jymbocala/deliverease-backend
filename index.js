import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on http://127.0.0.1:3000");
});

try {
  const m = await mongoose.connect(process.env.DB_URI); // connect to MongoDB
  console.log(
    m.connection.readyState === 1 // check if connected
      ? "Connected to MongoDB"
      : "Not connected to MongoDB"
  );
} catch (err) {
  console.log(err);
}

