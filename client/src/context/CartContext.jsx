import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'shoplite_cart_v1'

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { items: [] }
  } catch {
    return { items: [] }
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((it) => it.productId === action.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map((it) =>
            it.productId === action.productId
              ? { ...it, quantity: it.quantity + action.quantity }
              : it
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { productId: action.productId, quantity: action.quantity }],
      }
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter((it) => it.productId !== action.productId) }
    }
    case 'SET_QTY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((it) => it.productId !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map((it) =>
          it.productId === action.productId ? { ...it, quantity: action.quantity } : it
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo(() => {
    return {
      items: state.items,
      add: (productId, quantity = 1) => dispatch({ type: 'ADD', productId, quantity }),
      remove: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
