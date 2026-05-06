import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/tasks/[id]'>
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/tasks/[id]'>
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const body = await request.json()
  const { status } = body

  if (status !== 'todo' && status !== 'done') {
    return NextResponse.json(
      { error: 'status must be "todo" or "done"' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<'/api/tasks/[id]'>
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
