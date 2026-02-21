import Link from 'next/link'
import { BookCover } from './BookCover'

interface Book {
  id: string
  title: string
  author: string
  genre: string
  price: number
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-stone-100 transition-all duration-200 hover:-translate-y-0.5"
    >
      <BookCover
        title={book.title}
        author={book.author}
        genre={book.genre}
        className="h-52"
      />

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-amber mb-1">
          {book.genre}
        </span>
        <h3 className="font-serif font-semibold text-slate-800 text-[15px] leading-snug line-clamp-2 group-hover:text-brand-amber transition-colors">
          {book.title}
        </h3>
        <p className="text-[13px] text-slate-500 mt-0.5 mb-3">{book.author}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-slate-800 font-bold">${book.price.toFixed(2)}</span>
          <span className="text-xs text-slate-400 group-hover:text-brand-amber transition-colors font-medium">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
