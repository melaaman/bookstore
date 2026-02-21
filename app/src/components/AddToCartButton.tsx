'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useCart } from './CartProvider'

interface Props {
  bookId: string
  stock: number
}

export function AddToCartButton({ bookId, stock }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const { refreshCart } = useCart()
  const [state, setState] = useState<'idle' | 'loading' | 'added'>('idle')
  const [qty, setQty] = useState(1)

  async function handleAdd() {
    if (!session) {
      router.push('/login')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity: qty }),
      })
      if (!res.ok) throw new Error('Failed')
      setState('added')
      refreshCart()
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  if (stock === 0) {
    return (
      <button disabled className="w-full py-3.5 rounded-xl bg-stone-100 text-stone-400 font-semibold cursor-not-allowed">
        Out of Stock
      </button>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Quantity selector */}
      <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-full text-slate-600 hover:bg-stone-50 text-lg font-medium transition-colors"
          disabled={qty <= 1}
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-semibold text-slate-800">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="w-10 h-full text-slate-600 hover:bg-stone-50 text-lg font-medium transition-colors"
          disabled={qty >= stock}
        >
          +
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={state !== 'idle'}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
          state === 'added'
            ? 'bg-emerald-500 text-white'
            : 'bg-brand-navy hover:bg-slate-700 text-white shadow-sm'
        }`}
      >
        {state === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state === 'added' ? (
          <>
            <Check className="w-4 h-4" />
            Added to cart!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
