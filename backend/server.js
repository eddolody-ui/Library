const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
const Book = require('./models/Book');

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
  // Drop the erroneous isbn_1 index if it exists
  Book.collection.dropIndex('isbn_1', (err) => {
    if (err) {
      console.log('Index isbn_1 not found or already dropped:', err.message);
    } else {
      console.log('Dropped index isbn_1');
    }
  });

  // Initialize GridFS bucket after connection is established
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

  // Serve files from GridFS
  app.get('/api/files/:id', (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.id);
      gfs.openDownloadStream(fileId).pipe(res).on('error', (error) => {
        res.status(404).json({ message: 'File not found' });
      });
    } catch (error) {
      res.status(400).json({ message: 'Invalid file ID' });
    }
  });

  // Routes
  const booksRouter = require('./routes/books');
  app.use('/api/books', booksRouter);

  // Basic route
  app.get('/', (req, res) => {
    res.send('MiniLibrary Backend API');
  });

  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Declare gfs variable
let gfs;
