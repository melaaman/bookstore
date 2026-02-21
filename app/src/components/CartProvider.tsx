'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface CartContextType {
  cartCount: number
  refreshCart: () => void
}

const CartContext = createContext<CartContextType>({ cartCount: 0, refreshCart: () => {} })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)

  const refreshCart = useCallback(async () => {
    if (!session) return setCartCount(0)
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) return setCartCount(0)
      const data = await res.json()
      setCartCount(data.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0))
    } catch {
      setCartCount(0)
    }
  }, [session])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return <CartContext.Provider value={{ cartCount, refreshCart }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
