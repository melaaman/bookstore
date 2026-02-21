'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CheckCircle, Loader2, Package } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

interface CartItem {
  id: string
  quantity: number
  book: { id: string; title: string; author: string; price: number }
}

interface Order {
  id: string
  total: number
  status: string
  name: string
  address: string
  city: string
  zip: string
  country: string
  createdAt: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { refreshCart } = useCart()

  const [items, setItems] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: session?.user?.name ?? '',
    address: '',
    city: '',
    zip: '',
    country: '',
  })

  useEffect(() => {
    if (session?.user?.name) setForm((f) => ({ ...f, name: session.user.name! }))
  }, [session])

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((d) => {
        setItems(d)
        setLoadingCart(false)
      })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSubmitting(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong. Please try again.')
      return
    }

    const newOrder = await res.json()
    setOrder(newOrder)
    refreshCart()
  }

  const subtotal = items.reduce((s, i) => s + i.book.price * i.quantity, 0)
  const shipping = subtotal >= 35 ? 0 : 4.99
  const total = subtotal + shipping

  // Order confirmation screen
  if (order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
        <h1 className="font-serif text-3xl font-bold text-slate-800 mb-2">Order confirmed!</h1>
        <p className="text-slate-500 mb-6">
          Thank you, {order.name.split(' ')[0]}. Your books are on their way.
        </p>

        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5 text-left mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-3">
            <Package className="w-4 h-4" />
            Order #{order.id.slice(-8).toUpperCase()}
          </div>
          <div className="text-sm text-slate-500 space-y-1">
            <p>Shipping to: {order.address}, {order.city}, {order.zip} {order.country}</p>
            <p className="font-semibold text-slate-700">Total paid: ${order.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/books"
            className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-semibold hover:bg-slate-700 transition-colors text-sm"
          >
            Keep shopping
          </Link>
        </div>
      </div>
    )
  }

  if (loadingCart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-slate-800 mb-3">Nothing to check out</h1>
        <p className="text-slate-500 mb-6">Your cart is empty.</p>
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
      <h1 className="font-serif text-4xl font-bold text-slate-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-5">
              Shipping details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-brand-amber transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Street address
                </label>
                <input
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-brand-amber transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Helsinki"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-brand-amber transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Postal code
                  </label>
                  <input
                    name="zip"
                    required
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="00100"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-brand-amber transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <input
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Finland"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-amber/40 focus:border-brand-amber transition"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-navy hover:bg-slate-700 text-white font-semibold transition-colors shadow-sm disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Placing order…' : `Place order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-5">Your order</h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-medium text-slate-700 truncate">{item.book.title}</p>
                    <p className="text-slate-400 text-xs">×{item.quantity}</p>
                  </div>
                  <span className="font-semibold text-slate-700 flex-none">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-slate-800'}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base pt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
