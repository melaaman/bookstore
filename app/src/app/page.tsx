import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/BookCard'
import { ArrowRight, BookOpen, Star, Truck } from 'lucide-react'

export default async function HomePage() {
  const featured = await prisma.book.findMany({ take: 4, orderBy: { createdAt: 'asc' } })

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-brand-amber font-semibold text-sm uppercase tracking-widest mb-4">
            Independent Bookstore
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Your next great
            <br />
            read awaits.
          </h1>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Thoughtfully curated fiction, non-fiction, and everything in between.
            <br />
            Free shipping on orders over $35.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-amber hover:bg-brand-amber-light text-white font-semibold text-base transition-colors shadow-lg shadow-amber-900/30"
          >
            Browse the catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-brand-cream-dark border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-slate-600">
          {[
            { icon: Truck, text: 'Free shipping over $35' },
            { icon: Star, text: 'Curated by readers, for readers' },
            { icon: BookOpen, text: 'New titles added every week' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 py-2">
              <Icon className="w-4 h-4 text-brand-amber" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-1">
              Staff picks
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-800">Featured this week</h2>
          </div>
          <Link
            href="/books"
            className="text-sm font-medium text-slate-500 hover:text-brand-amber transition-colors flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}
