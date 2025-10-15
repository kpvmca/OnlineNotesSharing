import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <div>
        <h1>Your cart is empty</h1>
        <p>
          Browse our <Link to="/">products</Link> to get started.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cart.items.map((it) => (
          <CartItem key={it.productId} item={it} />
        ))}
      </div>
      <div className="cart-actions">
        <Link to="/checkout" className="primary">Proceed to Checkout</Link>
        <button className="link" onClick={() => cart.clear()}>Clear cart</button>
      </div>
    </div>
  )
}

function CartItem({ item }) {
  const cart = useCart()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/products/${item.productId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => alive && setProduct(data))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [item.productId])

  if (!product) return null
  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />
      <div className="cart-item-info">
        <div className="name">{product.name}</div>
        <div className="price">${product.price.toFixed(2)}</div>
        <div className="qty">
          <label>
            Qty
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => cart.setQuantity(item.productId, parseInt(e.target.value) || 1)}
            />
          </label>
          <button className="link" onClick={() => cart.remove(item.productId)}>Remove</button>
        </div>
      </div>
    </div>
  )
}
