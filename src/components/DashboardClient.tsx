'use client';

import { useApp } from '@/lib/context';
import { MemberCard } from './MemberCard';
import { AddMemberDialog } from './AddMemberDialog';
import { DateNav } from './DateNav';
import { SummaryBar } from './SummaryBar';
import { Users } from 'lucide-react';

export function DashboardClient() {
  const { state } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">팀 일간 관리</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DateNav />
            <AddMemberDialog />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <SummaryBar />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {state.members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <Users className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="text-lg font-medium">팀원이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                상단의 &quot;팀원 추가&quot; 버튼으로 팀원을 등록하세요
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
