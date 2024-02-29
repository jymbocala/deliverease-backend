import app from "./app.js"; 
import { connectToDatabase } from "./db.js"; 

connectToDatabase(); // Connects to the MongoDB database

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000'); // Logs a message when the server starts successfully
});