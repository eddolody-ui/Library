const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const multer = require('multer');
const mongoose = require('mongoose');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'coverImage' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for cover image!'), false);
    }
    if (file.fieldname === 'pdfFile' && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed for PDF file!'), false);
    }
    cb(null, true);
  }
});

// Function to upload file to GridFS
const uploadToGridFS = (file, bucketName) => {
  return new Promise((resolve, reject) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
      contentType: file.mimetype
    });
    uploadStream.end(file.buffer);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
};

// GET all books
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let query = {};
    if (searchQuery) {
      query.title = new RegExp(`^${searchQuery}$`, 'i');
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single book by ID
router.get('/:id', async (req, res) => {
  try {
    let book = null;
    // Try MongoDB ObjectId first
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Book.findById(req.params.id);
    }
    // If not found, try custom bookId
    if (!book) {
      book = await Book.findOne({ bookId: req.params.id });
    }
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new book
router.post('/', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), async (req, res) => {
  try {
    let coverImageId = null;
    let pdfFileId = null;

    if (req.files.coverImage && req.files.coverImage[0]) {
      coverImageId = await uploadToGridFS(req.files.coverImage[0], 'uploads');
    }

    if (req.files.pdfFile && req.files.pdfFile[0]) {
      pdfFileId = await uploadToGridFS(req.files.pdfFile[0], 'uploads');
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      coverImage: coverImageId,
      pdfFile: pdfFileId,
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.description = req.body.description || book.description;
    book.coverImage = req.body.coverImage || book.coverImage;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST upload PDF for a book
router.post('/:id/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const pdfFileId = await uploadToGridFS(req.file, 'uploads');
    book.pdfFile = pdfFileId;
    await book.save();
    res.json({ message: 'PDF uploaded successfully', pdfFile: pdfFileId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
