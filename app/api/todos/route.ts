import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { todos } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const todosList = await db.select().from(todos).orderBy(desc(todos.createdAt))
    
    // Return serialized data for client component
    const serializedTodos = todosList.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }))
    
    return NextResponse.json(serializedTodos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()
    
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const [todo] = await db.insert(todos).values({
      title: title.trim(),
      description: description?.trim() || null,
      status: 'pending'
    }).returning()

    // Return serialized data for client component
    const serializedTodo = {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }

    return NextResponse.json(serializedTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}
