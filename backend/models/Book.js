const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
        default: function () {
            return Math.floor(100000 + Math.random() * 900000).toString();
        },
        unique: true,
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
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
