import React from 'react'

const FloatingBooks: React.FC = () => {
  const books = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {books.map((book) => (
        <div
          key={book}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        >
          <div className="w-8 h-12 bg-primary rounded-sm shadow-lg transform rotate-12">
            <div className="w-full h-1 bg-secondary-foreground mt-1"></div>
            <div className="w-3/4 h-1 bg-secondary-foreground mt-1 ml-1"></div>
            <div className="w-1/2 h-1 bg-secondary-foreground mt-1 ml-1"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FloatingBooks
