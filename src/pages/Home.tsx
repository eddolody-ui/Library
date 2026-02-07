import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard'
import type { Book } from '../data/books'
import { API_BASE_URL } from '../lib/config'

const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/books`)
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
  }, [])

  const featuredBooks = books.slice(0, 4)
  const newArrivals = books.slice(2, 6)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome to Ei's Library
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover your next great read from our curated collection of books. Explore genres, find favorites, and embark on literary adventures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/books"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Books</h2>
        {loading ? (
          <div className="text-center py-8">Loading featured books...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section>
        <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
        {loading ? (
          <div className="text-center py-8">Loading new arrivals...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
