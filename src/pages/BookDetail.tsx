import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, BookOpen, Calendar, ArrowLeft, Heart, Share2 } from 'lucide-react'
import type { Book } from '../data/books'
import { API_BASE_URL } from '../lib/config'

const BookDetail = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`)
        if (!response.ok) {
          const errorMsg = `Failed to fetch book: ${response.status} ${response.statusText}`;
          throw new Error(errorMsg);
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    } else {
      setLoading(false);
      setError('No bookId provided');
    }
  }, [bookId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading book...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
        <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/books')}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Browse Books
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
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
              className="w-full max-w-sm mx-auto shadow-sm border-l"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/default-cover.png';
              }}
            />
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={() => {
                  if (book.pdfFile) {
                    const pdfUrl = `${API_BASE_URL}/${book.pdfFile.replace(/\\/g, '/')}`;
                    window.open(pdfUrl, '_blank');
                  } else {
                    alert('No PDF available for this book.');
                  }
                }}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Read Book
              </button>
              <button className="p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-muted-foreground">(4.5)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About this book</h2>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
