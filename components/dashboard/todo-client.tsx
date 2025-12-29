'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react'

interface Todo {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'completed'
  createdAt: string
  updatedAt: string
}

interface TodoClientProps {
  initialTodos: Todo[]
}

export default function TodoClient({ initialTodos }: TodoClientProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const addTodoHandler = async () => {
    if (!newTodoTitle.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle.trim(),
          description: newTodoDescription?.trim() || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add todo')
      }

      const newTodo = await response.json()
      setTodos([newTodo, ...todos])
      setNewTodoTitle('')
      setNewTodoDescription('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodoStatusHandler = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const newStatus = todo.status === 'pending' ? 'completed' : 'pending'

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(todos.map(t =>
        t.id === id ? updatedTodo : t
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodoHandler = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete todo')
      }

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    return todo.status === filter
  })

  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    completed: todos.filter(t => t.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Add New Task</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Task title..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Description (optional)..."
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addTodoHandler} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Tasks</h3>
            <p className="text-sm text-muted-foreground">View and manage your todo items</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No tasks found. Create your first task above!
                </TableCell>
              </TableRow>
            ) : (
              filteredTodos.map((todo) => (
                <TableRow key={todo.id} className={todo.status === 'completed' ? 'opacity-60' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={todo.status === 'completed'}
                      onCheckedChange={() => toggleTodoStatusHandler(todo.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {todo.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={todo.status === 'completed' ? 'line-through' : ''}>
                        {todo.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {todo.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={todo.status === 'completed' ? 'default' : 'secondary'}>
                      {todo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodoHandler(todo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
