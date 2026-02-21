import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookCover } from '@/components/BookCover'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ArrowLeft, Package } from 'lucide-react'

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({ where: { id: params.id } })
  if (!book) notFound()

  const stockLabel =
    book.stock === 0
      ? 'Out of stock'
      : book.stock < 5
        ? `Only ${book.stock} left`
        : 'In stock'

  const stockColor =
    book.stock === 0
      ? 'text-red-500'
      : book.stock < 5
        ? 'text-amber-600'
        : 'text-emerald-600'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-amber transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Cover */}
        <BookCover
          title={book.title}
          author={book.author}
          genre={book.genre}
          className="w-full aspect-[2/3] max-w-xs mx-auto rounded-2xl shadow-2xl"
        />

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="inline-block text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3">
            {book.genre}
          </span>

          <h1 className="font-serif text-4xl font-bold text-slate-800 leading-tight mb-2">
            {book.title}
          </h1>

          <p className="text-lg text-slate-500 mb-6">by {book.author}</p>

          <p className="text-3xl font-bold text-slate-800 mb-2">${book.price.toFixed(2)}</p>

          <div className={`flex items-center gap-1.5 text-sm font-medium ${stockColor} mb-8`}>
            <Package className="w-4 h-4" />
            {stockLabel}
          </div>

          <AddToCartButton bookId={book.id} stock={book.stock} />

          <div className="mt-10 pt-8 border-t border-stone-200">
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-3">About this book</h2>
            <p className="text-slate-600 leading-relaxed">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
