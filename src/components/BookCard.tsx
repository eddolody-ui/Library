import { Link } from 'react-router-dom'
import type { Book } from '../data/books'
import { API_BASE_URL } from '../lib/config'

interface BookCardProps {
  book: Book
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link
      to={`/books/${book._id}`}
      className="group rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[3/3] overflow-hidden">
        <img
          src={(() => {
            if (book.coverImage) {
              // Check if coverImage is an ObjectId (string representation)
              if (typeof book.coverImage === 'string' && book.coverImage.match(/^[0-9a-fA-F]{24}$/)) {
                return `${API_BASE_URL}/api/files/${book.coverImage}`;
              }
              // Fallback for old path-based images
              const normalized = book.coverImage.replace(/\\/g, '/');
              if (normalized.startsWith('uploads/')) {
                return `${API_BASE_URL}/${normalized}`;
              }
              return normalized;
            }
            return '/assets/default-cover.png';
          })()}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-muted-foreground mb-2">by {book.author}</p>
        <p>{book.description}</p>
      </div>
    </Link>
  )
}

export default BookCard
