const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://eddolody_db_user:X2dH1UFQVpOYNG2g@library.3xuvd9o.mongodb.net/?appName=Library';

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

// Routes
const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('MiniLibrary Backend API');
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
