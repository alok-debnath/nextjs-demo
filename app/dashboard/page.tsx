import TodoClient from '@/components/dashboard/todo-client'

export default async function Dashboard() {
  // Fetch initial data from API instead of Server Actions
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/todos`, {
    cache: 'no-store', // Ensure fresh data
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  
  const todos = await response.json()

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
