const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000; 

// Later: Connect to your MongoDB database with your database URL replacing the placeholder
mongoose.connect('mongodb://localhost:27017/your_database_name')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err)); 

// Later: Import and mount your routes (more on this in 2 weeks )

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
