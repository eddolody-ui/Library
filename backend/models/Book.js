const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  pdfFile: {
    type: String,
    default: null
  },
  genre: {
    type: String,
    default: ''
  },
  publicationYear: {
    type: Number,
    default: null
  },
  rating: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  isbn: {
    type: String,
    default: ''
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
