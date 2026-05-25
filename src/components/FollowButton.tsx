'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIsFollowing, followUser, unfollowUser, type UserId } from '../services/user.service';
import type { RootState } from '../../store';

interface FollowButtonProps {
  targetUserId?: UserId | null;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

const defaultClassName =
  'ml-4 flex h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60';

const FollowButton = ({ targetUserId, className, onFollowChange }: FollowButtonProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUserId = user?.id ?? user?._id;
  const isSelf = Boolean(
    targetUserId !== undefined &&
      targetUserId !== null &&
      currentUserId !== undefined &&
      String(targetUserId) === String(currentUserId),
  );

  useEffect(() => {
    if (!token || !targetUserId || isSelf) return;

    setLoading(true);
    checkIsFollowing(targetUserId)
      .then(setIsFollowing)
      .catch(() => setIsFollowing(false))
      .finally(() => setLoading(false));
  }, [isSelf, targetUserId, token]);

  const handleClick = async () => {
    if (!token) {
      toast.error('Please sign in to follow users');
      return;
    }

    if (!targetUserId || isSelf) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
      const nextValue = !isFollowing;
      setIsFollowing(nextValue);
      onFollowChange?.(nextValue);
    } catch (error) {
      console.error('Follow action failed:', error);
      toast.error('Unable to update follow status');
    } finally {
      setLoading(false);
    }
  };

  if (!targetUserId || isSelf) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className ?? defaultClassName}
    >
      {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;

