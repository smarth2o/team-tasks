'use client';

import { useApp } from '@/lib/context';
import { getTasksForDate } from '@/lib/store';

export function SummaryBar() {
  const { state, selectedDate } = useApp();
  const tasks = getTasksForDate(state.tasks, selectedDate);
  const standupCount = state.standups.filter((s) => s.date === selectedDate).length;

  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <span>
        <span className="font-semibold text-foreground">{state.members.length}</span> 팀원
      </span>
      <span>
        <span className="font-semibold text-foreground">{tasks.length}</span> 업무
        {tasks.length > 0 && (
          <span className="ml-1 text-xs">
            (할 일 {todo} · 진행 {inProgress} · 완료 {done})
          </span>
        )}
      </span>
      <span>
        <span className="font-semibold text-foreground">{standupCount}</span> 스탠드업
      </span>
    </div>
  );
}
