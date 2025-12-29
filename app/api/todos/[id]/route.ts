import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { todos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    if (status !== 'pending' && status !== 'completed') {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending or completed' },
        { status: 400 }
      )
    }

    const [todo] = await db.update(todos)
      .set({ status })
      .where(eq(todos.id, id))
      .returning()

    // Return serialized data for client component
    const serializedTodo = {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }

    return NextResponse.json(serializedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(todos).where(eq(todos.id, id))

    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}
