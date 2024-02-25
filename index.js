import app from "./app.js"; // Import the express application from app.js
import { connectToDatabase } from "./db.js"; // Import the connectToDatabase function from db.js

connectToDatabase(); // Connect to the MongoDB database

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000'); // Log a message when the server starts successfully
});