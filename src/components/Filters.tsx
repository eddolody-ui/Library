import React from 'react'

interface FiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedGenre: string
  onGenreChange: (value: string) => void
  genres: string[]
  sortBy: string
  onSortChange: (value: string) => void
}

const Filters: React.FC<FiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Search Input */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Books
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Genre Filter */}
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Publication Year</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  )
}

export default Filters
