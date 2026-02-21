import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/BookCard'
import { BooksSearch } from '@/components/BooksSearch'
import { GenreFilter } from '@/components/GenreFilter'

interface PageProps {
  searchParams: { search?: string; genre?: string }
}

export default async function BooksPage({ searchParams }: PageProps) {
  const { search = '', genre = '' } = searchParams

  const books = await prisma.book.findMany({
    where: {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
        ],
      }),
      ...(genre && genre !== 'all' && { genre }),
    },
    orderBy: { title: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-slate-800 mb-2">Browse books</h1>
        <p className="text-slate-500">
          {books.length} {books.length === 1 ? 'title' : 'titles'}
          {search && ` matching "${search}"`}
          {genre && genre !== 'all' && ` in ${genre}`}
        </p>
      </div>

      {/* Search + filter */}
      <div className="space-y-4 mb-10">
        <Suspense>
          <BooksSearch />
        </Suspense>
        <Suspense>
          <GenreFilter />
        </Suspense>
      </div>

      {/* Grid */}
      {books.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <p className="text-5xl mb-4">📚</p>
          <p className="font-serif text-xl font-semibold text-slate-500 mb-1">No books found</p>
          <p className="text-sm">Try a different search or genre filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
