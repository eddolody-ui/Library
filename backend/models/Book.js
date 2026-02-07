const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
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
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  pdfFile: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
},
{
  timestamps: true
});

// Pre-save hook to generate unique bookId
bookSchema.pre('save', async function(next) {
  if (!this.bookId) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
      const existingBook = await mongoose.model('Book').findOne({ bookId: generatedId });
      if (!existingBook) {
        this.bookId = generatedId;
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error('Unable to generate unique bookId after multiple attempts'));
    }
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
