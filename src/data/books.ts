export interface Book {
  _id: string;
  bookId?: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfFile?: string;
  genre?: string;
  publicationYear?: number;
  rating?: number;
  availability?: boolean;
  isbn?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Static books data removed - now fetching from API

export const genres = ['All', 'Fiction', 'Romance', 'Fantasy', 'Dystopian', 'Mystery', 'Science Fiction'];
