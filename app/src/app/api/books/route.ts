import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const genre = searchParams.get('genre') ?? ''

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
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(books)
}
