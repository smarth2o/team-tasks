'use client';

import { Task, TaskStatus } from '@/lib/types';
import { useApp } from '@/lib/context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2 } from 'lucide-react';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '할 일',
  'in-progress': '진행 중',
  done: '완료',
};

const STATUS_VARIANTS: Record<TaskStatus, 'secondary' | 'outline' | 'default'> = {
  todo: 'secondary',
  'in-progress': 'outline',
  done: 'default',
};

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-slate-400',
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const { updateTaskStatus, removeTask } = useApp();

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border p-3 text-sm transition-colors ${
        task.status === 'done' ? 'bg-muted/40 opacity-70' : 'bg-background'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium leading-snug ${
            task.status === 'done' ? 'line-through text-muted-foreground' : ''
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <p className={`mt-1 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" />}>
            <Badge variant={STATUS_VARIANTS[task.status]} className="text-xs pointer-events-none">
              {STATUS_LABELS[task.status]}
            </Badge>
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => updateTaskStatus(task.id, s)}
                className={task.status === s ? 'font-semibold' : ''}
              >
                {STATUS_LABELS[s]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeTask(task.id)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
