'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppState, Member, Task, Standup, TaskStatus } from './types';
import {
  loadState,
  saveState,
  generateId,
  getTodayString,
  getNextColor,
} from './store';

interface AppContextValue {
  state: AppState;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addMember: (name: string, role: string) => void;
  removeMember: (id: string) => void;
  addTask: (memberId: string, title: string, description: string, priority: Task['priority']) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  removeTask: (taskId: string) => void;
  saveStandup: (memberId: string, yesterday: string, today: string, blockers: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ members: [], tasks: [], standups: [] });
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const addMember = useCallback((name: string, role: string) => {
    setState((prev) => {
      const color = getNextColor(prev.members);
      const member: Member = { id: generateId(), name, role, color, createdAt: new Date().toISOString() };
      return { ...prev, members: [...prev.members, member] };
    });
  }, []);

  const removeMember = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      tasks: prev.tasks.filter((t) => t.memberId !== id),
      standups: prev.standups.filter((s) => s.memberId !== id),
    }));
  }, []);

  const addTask = useCallback(
    (memberId: string, title: string, description: string, priority: Task['priority']) => {
      setState((prev) => {
        const task: Task = {
          id: generateId(),
          memberId,
          date: selectedDate,
          title,
          description,
          status: 'todo',
          priority,
          createdAt: new Date().toISOString(),
        };
        return { ...prev, tasks: [...prev.tasks, task] };
      });
    },
    [selectedDate],
  );

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }));
  }, []);

  const saveStandup = useCallback(
    (memberId: string, yesterday: string, today: string, blockers: string) => {
      setState((prev) => {
        const existing = prev.standups.find((s) => s.memberId === memberId && s.date === selectedDate);
        if (existing) {
          return {
            ...prev,
            standups: prev.standups.map((s) =>
              s.id === existing.id ? { ...s, yesterday, today, blockers } : s,
            ),
          };
        }
        const standup: Standup = {
          id: generateId(),
          memberId,
          date: selectedDate,
          yesterday,
          today,
          blockers,
          createdAt: new Date().toISOString(),
        };
        return { ...prev, standups: [...prev.standups, standup] };
      });
    },
    [selectedDate],
  );

  if (!hydrated) return null;

  return (
    <AppContext.Provider
      value={{ state, selectedDate, setSelectedDate, addMember, removeMember, addTask, updateTaskStatus, removeTask, saveStandup }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
