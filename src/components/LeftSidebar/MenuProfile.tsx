'use client';

import { useSelector } from 'react-redux';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../../../store';

const MenuProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const displayName = user?.name || user?.username || 'Pulse user';
  const username = user?.username ? `@${user.username}` : user?.email || '@pulse';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="mb-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-slate-900 text-sm font-black text-white">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{displayName}</p>
        <p className="truncate text-xs text-slate-500">{username}</p>
      </div>
      <EllipsisHorizontalIcon className="h-5 w-5 text-slate-400" />
    </div>
  );
};

export default MenuProfile;

