import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const cart = useCart()

  useEffect(() => {
    let alive = true
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (alive) setProduct(data)
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
    return () => {
      alive = false
    }
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error) return <p role="alert">{error}</p>
  if (!product) return null

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} className="product-detail-image" />
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="muted">{product.category}</p>
        <p>{product.description}</p>
        <div className="price-row">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="rating">★ {product.rating}</span>
        </div>
        <div className="qty-row">
          <label>
            Qty
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </label>
          <button className="primary" onClick={() => cart.add(product.id, quantity)}>
            Add to cart
          </button>
          <Link to="/cart" className="link">Go to cart</Link>
        </div>
      </div>
    </div>
  )
}
