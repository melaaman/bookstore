'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

const GENRES = [
  'All',
  'Fiction',
  'Mystery',
  'Fantasy',
  'Science Fiction',
  'Biography',
  'Romance',
  'History',
  'Self-Help',
]

export function GenreFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const active = searchParams.get('genre') ?? 'all'

  function select(genre: string) {
    const params = new URLSearchParams(searchParams.toString())
    const val = genre.toLowerCase() === 'all' ? '' : genre
    if (val) {
      params.set('genre', val)
    } else {
      params.delete('genre')
    }
    startTransition(() => {
      router.push(`/books?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {GENRES.map((genre) => {
        const isActive =
          genre.toLowerCase() === 'all' ? !active || active === 'all' : active === genre
        return (
          <button
            key={genre}
            onClick={() => select(genre)}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-600 border border-stone-200 hover:border-brand-amber hover:text-brand-amber'
            }`}
          >
            {genre}
          </button>
        )
      })}
    </div>
  )
}
