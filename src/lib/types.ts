export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Standup {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  color: string;
  createdAt: string;
}

export interface AppState {
  members: Member[];
  tasks: Task[];
  standups: Standup[];
}
