import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, BookOpen, Moon, Sun, Upload } from 'lucide-react'
import type { Book } from '../data/books'
import { API_BASE_URL } from '../lib/config'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const isAdmin = true
  const navigate = useNavigate()

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/books?search=${encodeURIComponent(query)}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          // Filter for exact title matches (case-insensitive)
          const exactMatches = data.filter((book: Book) =>
            book.title.toLowerCase() === query.toLowerCase()
          )
          setSearchResults(exactMatches)
          setShowDropdown(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300),
    []
  )

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  const handleBookSelect = (book: Book) => {
    navigate(`/books/${book._id}`)
    setSearchQuery('')
    setShowDropdown(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Ei's Library
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/books" className="hover:text-primary transition-colors">Browse</Link>
            {isAdmin && (
              <Link to="/upload-pdf" className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" />
                Upload
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              {/* Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((book) => (
                        <button
                          key={book._id}
                          onClick={() => handleBookSelect(book)}
                          className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
                        >
                          <img
                            src={book.coverImage || '/assets/default-cover.png'}
                            alt={book.title}
                            className="w-8 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{book.title}</div>
                            <div className="text-xs text-muted-foreground truncate">by {book.author}</div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-border p-2">
                        <button
                          onClick={handleSearch}
                          className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No books found
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* User Menu, Theme Toggle & Admin Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>



            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/books" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Browse</Link>
              <Link to="/dashboard" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Admin</Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </form>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
