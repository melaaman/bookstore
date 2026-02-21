const genreGradients: Record<string, { gradient: string; textClass: string }> = {
  Fiction: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textClass: 'text-purple-100',
  },
  Mystery: {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    textClass: 'text-blue-200',
  },
  Fantasy: {
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    textClass: 'text-emerald-100',
  },
  'Science Fiction': {
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    textClass: 'text-cyan-200',
  },
  Biography: {
    gradient: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)',
    textClass: 'text-red-100',
  },
  Romance: {
    gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    textClass: 'text-pink-100',
  },
  History: {
    gradient: 'linear-gradient(135deg, #7b4f12 0%, #c8932a 100%)',
    textClass: 'text-amber-100',
  },
  'Self-Help': {
    gradient: 'linear-gradient(135deg, #1a6b4a 0%, #3cb371 100%)',
    textClass: 'text-green-100',
  },
}

const fallback = {
  gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
  textClass: 'text-gray-200',
}

interface Props {
  title: string
  author: string
  genre: string
  className?: string
}

export function BookCover({ title, author, genre, className = '' }: Props) {
  const { gradient, textClass } = genreGradients[genre] ?? fallback

  return (
    <div
      className={`relative flex flex-col justify-between p-4 select-none ${className}`}
      style={{ background: gradient }}
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-white" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-white" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-white" />
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-white/30 rounded-sm" />
      </div>

      <div className={`relative text-xs font-semibold uppercase tracking-widest ${textClass} opacity-70`}>
        {genre}
      </div>

      <div className="relative mt-auto">
        <p className={`font-serif font-bold leading-tight text-lg ${textClass} mb-1.5`}>{title}</p>
        <p className={`text-xs ${textClass} opacity-70`}>{author}</p>
      </div>
    </div>
  )
}
