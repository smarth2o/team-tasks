'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/context';
import { UserPlus } from 'lucide-react';

export function AddMemberDialog() {
  const { addMember } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addMember(name.trim(), role.trim());
    setName('');
    setRole('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UserPlus className="mr-1.5 h-4 w-4" />
        팀원 추가
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>팀원 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="member-name">이름</Label>
            <Input
              id="member-name"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-role">역할</Label>
            <Input
              id="member-role"
              placeholder="프론트엔드, 백엔드 등"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim()}>
            추가
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
