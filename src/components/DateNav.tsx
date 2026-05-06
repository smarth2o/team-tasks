'use client';

import { useApp } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { formatDate, getTodayString } from '@/lib/store';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function DateNav() {
  const { selectedDate, setSelectedDate } = useApp();
  const today = getTodayString();
  const isToday = selectedDate === today;

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1.5 min-w-[160px] justify-center">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
        {isToday && (
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 leading-none">
            오늘
          </span>
        )}
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isToday && (
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSelectedDate(today)}>
          오늘로
        </Button>
      )}
    </div>
  );
}
