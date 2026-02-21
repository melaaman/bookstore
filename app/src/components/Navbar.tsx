'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, BookOpen, LogOut, User } from 'lucide-react'
import { useCart } from './CartProvider'

export function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-amber flex items-center justify-center shadow-sm group-hover:bg-brand-amber-light transition-colors">
              <BookOpen className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-semibold text-white tracking-tight">
              Folio
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/books"
              className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
            >
              Browse
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/cart"
                  className="relative p-2 text-slate-300 hover:text-white transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-bold bg-brand-amber text-white rounded-full flex items-center justify-center leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <div className="hidden sm:flex items-center gap-1 text-sm text-slate-300">
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-slate-300 hover:text-white transition-colors font-medium px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-3.5 py-1.5 rounded-md bg-brand-amber hover:bg-brand-amber-light text-white transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
