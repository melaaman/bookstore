import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { book: true },
    orderBy: { id: 'asc' },
  })

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { bookId, quantity = 1 } = await req.json()
  if (!bookId) return NextResponse.json({ error: 'bookId required' }, { status: 400 })

  const item = await prisma.cartItem.upsert({
    where: { userId_bookId: { userId: session.user.id, bookId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.user.id, bookId, quantity },
    include: { book: true },
  })

  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { bookId, quantity } = await req.json()
  if (!bookId || quantity == null) {
    return NextResponse.json({ error: 'bookId and quantity required' }, { status: 400 })
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { userId_bookId: { userId: session.user.id, bookId } },
    })
    return NextResponse.json({ deleted: true })
  }

  const item = await prisma.cartItem.update({
    where: { userId_bookId: { userId: session.user.id, bookId } },
    data: { quantity },
    include: { book: true },
  })

  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get('bookId')

  if (bookId) {
    await prisma.cartItem.delete({
      where: { userId_bookId: { userId: session.user.id, bookId } },
    })
  } else {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } })
  }

  return NextResponse.json({ ok: true })
}
