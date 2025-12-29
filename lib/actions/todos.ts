'use server'

import { db } from '@/lib/db'
import { todos } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getTodos() {
  try {
    const todosList = await db.select().from(todos).orderBy(desc(todos.createdAt))
    // Return serialized data for client component
    return todosList.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching todos:', error)
    return []
  }
}

export async function addTodo(title: string, description?: string) {
  try {
    if (!title || title.trim() === '') {
      throw new Error('Title is required')
    }

    const [todo] = await db.insert(todos).values({
      title: title.trim(),
      description: description?.trim() || null,
      status: 'pending'
    }).returning()

    revalidatePath('/dashboard')
    // Return serialized data for client component
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

export async function updateTodoStatus(id: string, status: 'pending' | 'completed') {
  try {
    const [todo] = await db.update(todos)
      .set({ status })
      .where(eq(todos.id, id))
      .returning()

    revalidatePath('/dashboard')
    // Return serialized data for client component
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export async function deleteTodo(id: string) {
  try {
    await db.delete(todos).where(eq(todos.id, id))

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
