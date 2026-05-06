'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/database.types'

type Task = Tables<'tasks'>

export default function Home() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const res = await fetch('/api/tasks')
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    })
    setTitle('')
    fetchTasks()
  }

  async function toggleStatus(task: Task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: task.status === 'done' ? 'todo' : 'done' }),
    })
    fetchTasks()
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">팀 일감</h1>
          <div className="flex items-center gap-3">
            {email && (
              <span className="text-sm text-muted-foreground hidden sm:block">{email}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            placeholder="새 일감 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!title.trim()}>추가</Button>
        </form>

        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 일감이 없습니다.</p>
        ) : (
          <ul className="divide-y rounded-lg border overflow-hidden">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 px-4 py-3 bg-background hover:bg-muted/30 transition-colors">
                <button
                  onClick={() => toggleStatus(task)}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                    task.status === 'done'
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  }`}
                  aria-label={task.status === 'done' ? '할 일로 되돌리기' : '완료로 표시'}
                />
                <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </span>
                <Badge variant={task.status === 'done' ? 'default' : 'secondary'} className="text-xs">
                  {task.status === 'done' ? '완료' : '할 일'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                  aria-label="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
