import app from "./app.js";
import { connectToDatabase } from "./db.js";

connectToDatabase();

app.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000');
} );

