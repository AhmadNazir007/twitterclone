'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FollowButton from '../FollowButton';
import { getFollowSuggestions, type PublicUser } from '../../services/user.service';
import type { RootState } from '../../../store';

const getDisplayName = (user: PublicUser) => user.name || user.username || user.email || 'Pulse user';
const getHandle = (user: PublicUser) => user.username ? `@${user.username}` : user.email || `user-${user.id}`;

const Rightdown = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    getFollowSuggestions()
      .then(setUsers)
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  if (!token) {
    return (
      <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        Sign in to discover people to follow.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-3 space-y-3">
        {[1, 2].map((item) => (
          <div key={item} className="flex animate-pulse items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
            <div className="h-9 w-20 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        No new suggestions right now.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {users.map((user) => {
        const displayName = getDisplayName(user);
        const initials = displayName.slice(0, 2).toUpperCase();

        return (
          <div key={String(user.id)} className="flex items-center gap-3">
            <Link
              href={`/profile/${user.id}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-slate-950 text-sm font-black text-white"
              title={displayName}
            >
              {initials}
            </Link>
            <Link href={`/profile/${user.id}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950">{displayName}</p>
              <p className="truncate text-xs text-slate-500">{getHandle(user)}</p>
            </Link>
            <FollowButton
              targetUserId={user.id}
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              onFollowChange={(isFollowing) => {
                if (isFollowing) {
                  setUsers((currentUsers) => currentUsers.filter((item) => String(item.id) !== String(user.id)));
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Rightdown;


