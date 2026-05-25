'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import {
  CalendarDaysIcon,
  MapPinIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { AppIcons } from '@/app/assets';
import type { RootState } from '../../../store';
import FollowButton from '../FollowButton';
import { getUser, type PublicUser, type UserId } from '../../services/user.service';

const getId = (user?: { id?: UserId; _id?: string } | null) =>
  user?.id !== undefined ? String(user.id) : user?._id || '';

const Profile = ({ profileUserId }: { profileUserId?: UserId }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const isOwnProfile = !profileUserId || String(profileUserId) === getId(currentUser);

  useEffect(() => {
    if (!profileUserId || isOwnProfile) {
      setProfileUser(null);
      return;
    }

    setIsLoadingUser(true);
    getUser(profileUserId)
      .then(setProfileUser)
      .catch(() => setProfileUser(null))
      .finally(() => setIsLoadingUser(false));
  }, [isOwnProfile, profileUserId]);

  const displayUser = isOwnProfile ? currentUser : profileUser;
  const displayName = displayUser?.name || displayUser?.username || displayUser?.email || 'Pulse user';
  const username = displayUser?.username ? `@${displayUser.username}` : displayUser?.email || '@username';
  const followersCount = displayUser?.followersCount ?? 72;
  const followingCount = displayUser?.followingCount ?? 569;

  const headerTitle = useMemo(() => {
    if (isLoadingUser) return 'Loading profile';
    return displayName;
  }, [displayName, isLoadingUser]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Profile</p>
        <h1 className="text-2xl font-black text-slate-950">{headerTitle}</h1>
      </header>

      <section>
        <div className="relative h-44 overflow-hidden bg-slate-900 sm:h-56">
          <Image
            src={AppIcons.profile_background}
            alt="Profile cover"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>

        <div className="px-4 pb-6 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <Image
              src={AppIcons.avatar_main}
              alt="Profile avatar"
              width={128}
              height={128}
              className="-mt-16 h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
            />
            <div className="mb-3 flex items-center gap-2">
              {isOwnProfile ? (
                <button className="flex h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700">
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>
              ) : (
                <FollowButton targetUserId={profileUserId} />
              )}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-950">{displayName}</h2>
            <p className="text-sm font-medium text-slate-500">{username}</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700">
              Building conversations, sharing updates, and keeping the timeline moving.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-5 w-5" />
                Remote
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-5 w-5" />
                Joined today
              </span>
            </div>
            <div className="mt-5 flex gap-5 text-sm">
              <span><b className="text-slate-950">{followingCount}</b> <span className="text-slate-500">Following</span></span>
              <span><b className="text-slate-950">{followersCount}</b> <span className="text-slate-500">Followers</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-y border-slate-200 text-center text-sm font-bold text-slate-500">
          {['Posts', 'Replies', 'Media', 'Likes'].map((tab, index) => (
            <button
              key={tab}
              className={`py-4 transition hover:bg-slate-50 ${index === 0 ? 'border-b-2 border-teal-600 text-teal-700' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-6 py-14 text-center">
          <h3 className="text-lg font-black text-slate-950">Profile timeline is ready</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Connect a user-specific posts endpoint to show this user&apos;s posts here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Profile;


