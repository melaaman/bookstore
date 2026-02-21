'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

interface CartItem {
  id: string
  quantity: number
  book: { id: string; title: string; author: string; genre: string; price: number }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { refreshCart } = useCart()
  const router = useRouter()

  async function fetchCart() {
    const res = await fetch('/api/cart')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  async function updateQty(bookId: string, quantity: number) {
    setUpdating(bookId)
    await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, quantity }),
    })
    await fetchCart()
    refreshCart()
    setUpdating(null)
  }

  async function remove(bookId: string) {
    setUpdating(bookId)
    await fetch(`/api/cart?bookId=${bookId}`, { method: 'DELETE' })
    await fetchCart()
    refreshCart()
    setUpdating(null)
  }

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-6" />
        <h1 className="font-serif text-3xl font-bold text-slate-800 mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Find something you&apos;ll love in our catalogue.</p>
        <Link
          href="/books"
          className="inline-flex px-6 py-3 rounded-xl bg-brand-navy text-white font-semibold hover:bg-slate-700 transition-colors"
        >
          Browse books
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-4xl font-bold text-slate-800 mb-8">Shopping cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-stone-100"
            >
              {/* Cover swatch */}
              <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex-none flex items-center justify-center">
                <span className="font-serif text-white text-[10px] text-center leading-tight px-1">
                  {item.book.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/books/${item.book.id}`}
                  className="font-serif font-semibold text-slate-800 hover:text-brand-amber transition-colors line-clamp-1"
                >
                  {item.book.title}
                </Link>
                <p className="text-sm text-slate-500 mt-0.5">{item.book.author}</p>
                <p className="text-sm text-brand-amber font-semibold mt-0.5">
                  ${item.book.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.book.id, item.quantity - 1)}
                      disabled={!!updating}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-stone-50 transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-800">
                      {updating === item.book.id ? (
                        <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      onClick={() => updateQty(item.book.id, item.quantity + 1)}
                      disabled={!!updating}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-stone-50 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => remove(item.book.id)}
                    disabled={!!updating}
                    className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right flex-none">
                <span className="font-bold text-slate-800">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-5">Order summary</h2>

            <div className="space-y-3 text-sm text-slate-600 mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={subtotal >= 35 ? 'text-emerald-600 font-medium' : 'font-medium text-slate-800'}>
                  {subtotal >= 35 ? 'Free' : '$4.99'}
                </span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-slate-800 text-base">
                <span>Total</span>
                <span>${(subtotal + (subtotal >= 35 ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 35 && (
              <p className="text-xs text-slate-400 bg-stone-50 rounded-lg px-3 py-2 mb-4">
                Add ${(35 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 rounded-xl bg-brand-navy hover:bg-slate-700 text-white font-semibold transition-colors shadow-sm"
            >
              Proceed to checkout
            </button>

            <Link
              href="/books"
              className="block text-center text-sm text-slate-400 hover:text-brand-amber transition-colors mt-3"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
