import { useState, useMemo } from 'react'
import { useCart } from '../context/CartContext'

export default function CheckoutPage() {
  const cart = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [order, setOrder] = useState(null)

  const itemsDetailed = useMemo(() => {
    return cart.items
  }, [cart.items])

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items, customer: { name, email } }),
      })
      if (!res.ok) throw new Error('Failed to place order')
      const data = await res.json()
      setOrder(data)
      cart.clear()
      setStatus('success')
    } catch (e) {
      setStatus('error')
    }
  }

  const summary = useMemo(() => {
    return itemsDetailed.reduce(
      (acc, it) => {
        return { ...acc, items: acc.items + it.quantity }
      },
      { items: 0 }
    )
  }, [itemsDetailed])

  if (status === 'success' && order) {
    return (
      <div>
        <h1>Order Confirmed</h1>
        <p>Thank you, {order.customer?.name || 'Customer'}!</p>
        <p>Order ID: <strong>{order.orderId}</strong></p>
        <div className="order-box">
          <div>Items: {order.items.length}</div>
          <div>Subtotal: ${order.amounts.subtotal.toFixed(2)}</div>
          <div>Shipping: ${order.amounts.shipping.toFixed(2)}</div>
          <div>Tax: ${order.amounts.tax.toFixed(2)}</div>
          <div className="total">Total: ${order.amounts.total.toFixed(2)}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Checkout</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="checkout-form">
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
          <button className="primary" disabled={status === 'submitting'} onClick={handlePlaceOrder}>
            {status === 'submitting' ? 'Placing order…' : 'Place Order'}
          </button>
          {status === 'error' && <p role="alert">Something went wrong. Try again.</p>}
        </>
      )}
    </div>
  )
}
