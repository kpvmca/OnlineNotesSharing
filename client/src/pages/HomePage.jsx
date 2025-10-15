import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (alive) setProducts(data)
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <p>Loading products…</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <div>
      <h1>Featured Products</h1>
      <div className="grid">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="card product-card">
            <img src={p.image} alt={p.name} className="product-image" />
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-meta">
                <span>${p.price.toFixed(2)}</span>
                <span className="rating">★ {p.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
