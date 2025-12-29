import { getTodos } from '@/lib/actions/todos'
import TodoClient from '@/components/dashboard/todo-client'

export default async function Dashboard() {
  // Server-side data fetching - this runs on the server
  const todos = await getTodos()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks and stay productive</p>
        </div>
      </div>

      {/* Pass server-fetched data to client component */}
      <TodoClient initialTodos={todos} />
    </div>
  )
}
