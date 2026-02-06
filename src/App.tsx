import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BookListing from './pages/BookListing'
import BookDetail from './pages/BookDetail'
import UploadPdf from './pages/UploadPdf'
import './index.css'

function App() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookListing />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/upload-pdf" element={<UploadPdf />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
