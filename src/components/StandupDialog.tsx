'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/context';
import { getStandupForDate } from '@/lib/store';
import { ClipboardList } from 'lucide-react';

interface Props {
  memberId: string;
}

export function StandupDialog({ memberId }: Props) {
  const { state, selectedDate, saveStandup } = useApp();
  const [open, setOpen] = useState(false);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');

  useEffect(() => {
    if (open) {
      const existing = getStandupForDate(state.standups, selectedDate, memberId);
      setYesterday(existing?.yesterday ?? '');
      setToday(existing?.today ?? '');
      setBlockers(existing?.blockers ?? '');
    }
  }, [open, state.standups, selectedDate, memberId]);

  const hasStandup = !!getStandupForDate(state.standups, selectedDate, memberId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStandup(memberId, yesterday, today, blockers);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            className={`h-7 px-2 text-xs ${hasStandup ? 'text-green-600' : ''}`}
          />
        }
      >
        <ClipboardList className="h-3.5 w-3.5 mr-1" />
        {hasStandup ? '스탠드업 수정' : '스탠드업'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>일일 스탠드업</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="yesterday">어제 한 일</Label>
            <Textarea
              id="yesterday"
              placeholder="어제 완료한 업무를 입력하세요"
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              rows={3}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="today">오늘 할 일</Label>
            <Textarea
              id="today"
              placeholder="오늘 진행할 업무를 입력하세요"
              value={today}
              onChange={(e) => setToday(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blockers">블로커 / 이슈</Label>
            <Textarea
              id="blockers"
              placeholder="없으면 비워두세요"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full">
            저장
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
