'use client';

import { Member } from '@/lib/types';
import { useApp } from '@/lib/context';
import { getTasksForDate, getStandupForDate } from '@/lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskItem } from './TaskItem';
import { AddTaskDialog } from './AddTaskDialog';
import { StandupDialog } from './StandupDialog';
import { MoreVertical, Trash2 } from 'lucide-react';

interface Props {
  member: Member;
}

export function MemberCard({ member }: Props) {
  const { state, selectedDate, removeMember } = useApp();
  const tasks = getTasksForDate(state.tasks, selectedDate, member.id);
  const standup = getStandupForDate(state.standups, selectedDate, member.id);

  const done = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const initials = member.name.slice(0, 2);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className={`${member.color} text-white text-sm font-semibold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none">{member.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <StandupDialog memberId={member.id} />
            <AddTaskDialog memberId={member.id} />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <MoreVertical className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => removeMember(member.id)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  팀원 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>진행률</span>
              <span>
                {done}/{tasks.length} 완료
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 space-y-2">
        {standup && (
          <>
            <div className="rounded-md bg-muted/50 p-3 text-xs space-y-2">
              <div>
                <span className="font-medium text-muted-foreground">어제</span>
                <p className="mt-0.5 whitespace-pre-wrap">{standup.yesterday}</p>
              </div>
              {standup.today && (
                <div>
                  <span className="font-medium text-muted-foreground">오늘</span>
                  <p className="mt-0.5 whitespace-pre-wrap">{standup.today}</p>
                </div>
              )}
              {standup.blockers && (
                <div>
                  <span className="font-medium text-red-500">블로커</span>
                  <p className="mt-0.5 whitespace-pre-wrap">{standup.blockers}</p>
                </div>
              )}
            </div>
            {tasks.length > 0 && <Separator />}
          </>
        )}

        {tasks.length === 0 && !standup && (
          <p className="text-center text-xs text-muted-foreground py-6">
            업무나 스탠드업을 추가하세요
          </p>
        )}

        {tasks.length > 0 && (
          <div className="space-y-1.5">
            {(['high', 'medium', 'low'] as const).flatMap((p) =>
              tasks
                .filter((t) => t.priority === p)
                .sort((a) => (a.status === 'done' ? 1 : -1))
                .map((task) => <TaskItem key={task.id} task={task} />),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
