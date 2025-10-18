import { useEffect, useMemo, useState } from 'react'
import './App.css'

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
}

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  // Use relative '/api' by default; override via VITE_API_BASE when needed
  const apiBase = import.meta.env.VITE_API_BASE || ''

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${apiBase}/api/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError(e.message || 'Error loading products')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [apiBase])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  function decrementFromCart(productId) {
    setCart(prev => prev.flatMap(item => {
      if (item.id !== productId) return [item]
      if (item.quantity <= 1) return []
      return [{ ...item, quantity: item.quantity - 1 }]
    }))
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  async function handleCheckout() {
    try {
      setCheckingOut(true)
      const res = await fetch(`${apiBase}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Checkout failed')
      }
      const data = await res.json()
      alert(`Order ${data.orderId} placed successfully! Total ${formatCurrency(data.total)}`)
      setCart([])
    } catch (e) {
      alert(e.message || 'Checkout error')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>ShopEasy</h1>
        <div className="cart-summary">
          <span>{cart.reduce((n, i) => n + i.quantity, 0)} items</span>
          <strong>{formatCurrency(cartTotal)}</strong>
        </div>
      </header>

      {loading && <p className="status">Loading products…</p>}
      {error && <p className="status error">{error}</p>}

      <main className="layout">
        <section className="products">
          {products.map(p => (
            <article className="product-card" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="desc">{p.description}</p>
                <div className="price-row">
                  <span className="price">{formatCurrency(p.price)}</span>
                  <button className="add" onClick={() => addToCart(p)}>Add to cart</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty</p>
          ) : (
            <ul className="cart-list">
              {cart.map(item => (
                <li key={item.id} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <div className="muted">{formatCurrency(item.price)} each</div>
                  </div>
                  <div className="cart-actions">
                    <button onClick={() => decrementFromCart(item.id)} aria-label="Decrease">−</button>
                    <span className="qty">{item.quantity}</span>
                    <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })} aria-label="Increase">+</button>
                    <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout">
            <div className="total">Total: {formatCurrency(cartTotal)}</div>
            <button disabled={cart.length === 0 || checkingOut} onClick={handleCheckout}>
              {checkingOut ? 'Processing…' : 'Checkout'}
            </button>
          </div>
        </aside>
      </main>

      <footer className="footer">© {new Date().getFullYear()} ShopEasy</footer>
    </div>
  )
}

export default App
