import express from "express";
import { forgotPassword } from "../controllers/authController.js";

const router = express.Router();

// Define route for forgot password
router.post("/", forgotPassword);

export default router;



