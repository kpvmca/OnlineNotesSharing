import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <header className="site-header">
          <div className="container header-inner">
            <Link to="/" className="brand">ShopLite</Link>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
            </nav>
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="container">© {new Date().getFullYear()} ShopLite</div>
        </footer>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
