'use client';

import { AppState, Member, Task, Standup } from './types';

const STORAGE_KEY = 'team-daily-app';

const MEMBER_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500',
];

const DEFAULT_STATE: AppState = {
  members: [
    { id: '1', name: '김민준', role: '프론트엔드', color: 'bg-blue-500', createdAt: new Date().toISOString() },
    { id: '2', name: '이서연', role: '백엔드', color: 'bg-green-500', createdAt: new Date().toISOString() },
    { id: '3', name: '박도현', role: '디자이너', color: 'bg-purple-500', createdAt: new Date().toISOString() },
  ],
  tasks: [],
  standups: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as AppState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getNextColor(members: Member[]): string {
  const usedColors = members.map((m) => m.color);
  return MEMBER_COLORS.find((c) => !usedColors.includes(c)) ?? MEMBER_COLORS[members.length % MEMBER_COLORS.length];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

export function getTasksForDate(tasks: Task[], date: string, memberId?: string): Task[] {
  return tasks.filter(
    (t) => t.date === date && (memberId === undefined || t.memberId === memberId),
  );
}

export function getStandupForDate(standups: Standup[], date: string, memberId: string): Standup | undefined {
  return standups.find((s) => s.date === date && s.memberId === memberId);
}
