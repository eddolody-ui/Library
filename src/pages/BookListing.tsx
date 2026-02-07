
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import type { Book } from '../data/books'

const BookListing = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const searchQuery = searchParams.get('search')
        const url = searchQuery
          ? `https://librarybeckend.onrender.com/api/books?search=${encodeURIComponent(searchQuery)}`
          : 'https://librarybeckend.onrender.com/api/books'
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        setBooks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [searchParams])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">All Books</h1>
        <p className="text-muted-foreground">Browse our complete collection of books</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading books...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BookListing
