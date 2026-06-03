'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  PencilSquareIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AppIcons } from '@/app/assets';
import type { AppDispatch, RootState } from '../../../store';
import { loginSuccess } from '../../../store/slices/authSlice';
import FollowButton from '../FollowButton';
import {
  getUserLikedPosts,
  getUserPosts,
  getUserReplies,
  type Post,
  type PostReply,
} from '../../services/post.service';
import { getMe, getUser, updateMe, type PublicUser, type UserId } from '../../services/user.service';

type ProfileTab = 'Posts' | 'Replies' | 'Media' | 'Likes';

const getId = (user?: { id?: UserId; _id?: string } | null) =>
  user?.id !== undefined ? String(user.id) : user?._id || '';

const getDisplayName = (user?: PublicUser | null) =>
  user?.name || user?.username || user?.email || 'Pulse user';

const getPostAuthorName = (post: Post) =>
  post.author?.name || post.author?.username || post.author?.email || 'Pulse user';

const formatJoinedDate = (createdAt?: string) => {
  if (!createdAt) return 'Joined date unavailable';

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Joined date unavailable';

  return `Joined ${new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)}`;
};

const Profile = ({ profileUserId }: { profileUserId?: UserId }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user: currentUser } = useSelector((state: RootState) => state.auth);
  const [ownProfile, setOwnProfile] = useState<PublicUser | null>(currentUser);
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [profileReplies, setProfileReplies] = useState<PostReply[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>('Posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [postsError, setPostsError] = useState('');
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    avatarUrl: '',
  });

  const isOwnProfile = !profileUserId || String(profileUserId) === getId(currentUser);

  useEffect(() => {
    setOwnProfile(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!isOwnProfile || !token) return;

    setIsLoadingUser(true);
    getMe()
      .then((user) => {
        setOwnProfile(user);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess({ token, user }));
      })
      .catch(() => undefined)
      .finally(() => setIsLoadingUser(false));
  }, [dispatch, isOwnProfile, token]);

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

  const displayUser = isOwnProfile ? ownProfile : profileUser;
  const displayName = getDisplayName(displayUser);
  const username = displayUser?.username ? `@${displayUser.username}` : displayUser?.email || '@username';
  const bio = displayUser?.bio?.trim() || 'No bio added yet.';
  const location = displayUser?.location?.trim() || 'Location not set';
  const avatarUrl = displayUser?.avatarUrl?.trim();
  const shouldShowAvatarImage = Boolean(avatarUrl && !avatarLoadFailed);
  const initials = displayName.slice(0, 2).toUpperCase();
  const followersCount = displayUser?.followersCount ?? 0;
  const followingCount = displayUser?.followingCount ?? 0;
  const joinedLabel = formatJoinedDate(displayUser?.createdAt);
  const displayUserId = getId(displayUser);

  const headerTitle = useMemo(() => {
    if (isLoadingUser) return 'Loading profile';
    return displayName;
  }, [displayName, isLoadingUser]);

  useEffect(() => {
    if (!displayUserId) {
      setProfilePosts([]);
      setProfileReplies([]);
      setLikedPosts([]);
      return;
    }

    setIsLoadingPosts(true);
    setPostsError('');
    Promise.all([
      getUserPosts(displayUserId),
      getUserReplies(displayUserId),
      getUserLikedPosts(displayUserId),
    ])
      .then(([posts, replies, likes]) => {
        setProfilePosts(posts);
        setProfileReplies(replies);
        setLikedPosts(likes);
      })
      .catch(() => {
        setProfilePosts([]);
        setProfileReplies([]);
        setLikedPosts([]);
        setPostsError('Unable to load profile activity');
      })
      .finally(() => setIsLoadingPosts(false));
  }, [displayUserId]);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [avatarUrl]);

  const openEditor = () => {
    setEditForm({
      name: displayUser?.name || '',
      bio: displayUser?.bio || '',
      location: displayUser?.location || '',
      avatarUrl: displayUser?.avatarUrl || '',
    });
    setIsEditing(true);
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!token) {
      toast.error('Please sign in to edit your profile');
      return;
    }

    if (!editForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await updateMe(editForm);
      setOwnProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(loginSuccess({ token, user: updatedUser }));
      setIsEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Unable to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const mediaPosts = profilePosts.filter((post) => post.mediaUrl?.trim());
  const visiblePosts =
    activeTab === 'Posts' ? profilePosts : activeTab === 'Media' ? mediaPosts : likedPosts;

  const emptyTabMessage: Record<ProfileTab, string> = {
    Posts: isOwnProfile ? 'Your posts will show here after you publish them.' : `${displayName} has not posted yet.`,
    Replies: isOwnProfile ? 'Your replies will show here after you comment on posts.' : `${displayName} has not replied yet.`,
    Media: isOwnProfile ? 'Your posts with media will show here.' : `${displayName} has not posted media yet.`,
    Likes: isOwnProfile ? 'Posts you like will show here.' : `${displayName} has not liked any posts yet.`,
  };

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
            <div className="relative z-10 -mt-12 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-slate-950 text-3xl font-black text-white shadow-lg sm:-mt-14 sm:h-32 sm:w-32">
              {shouldShowAvatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full bg-white object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                initials
              )}
            </div>
            <div className="mb-3 flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  onClick={openEditor}
                  className="flex h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push(`/messages?userId=${getId(displayUser)}`)}
                    className="flex h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    Message
                  </button>
                  <FollowButton targetUserId={profileUserId} />
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Name
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    maxLength={80}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none ring-teal-500/20 transition focus:border-teal-300 focus:ring-4"
                  />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Location
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    maxLength={80}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none ring-teal-500/20 transition focus:border-teal-300 focus:ring-4"
                  />
                </label>
              </div>
              <label className="mt-3 block text-sm font-bold text-slate-700">
                Avatar URL
                <input
                  name="avatarUrl"
                  value={editForm.avatarUrl}
                  onChange={handleEditChange}
                  maxLength={500}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none ring-teal-500/20 transition focus:border-teal-300 focus:ring-4"
                />
              </label>
              <label className="mt-3 block text-sm font-bold text-slate-700">
                Bio
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  maxLength={160}
                  className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none ring-teal-500/20 transition focus:border-teal-300 focus:ring-4"
                />
              </label>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex h-10 items-center gap-2 rounded-full bg-teal-600 px-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
                >
                  <CheckIcon className="h-5 w-5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-950">{displayName}</h2>
            <p className="text-sm font-medium text-slate-500">{username}</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700">{bio}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-5 w-5" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-5 w-5" />
                {joinedLabel}
              </span>
            </div>
            <div className="mt-5 flex gap-5 text-sm">
              <span><b className="text-slate-950">{followingCount}</b> <span className="text-slate-500">Following</span></span>
              <span><b className="text-slate-950">{followersCount}</b> <span className="text-slate-500">Followers</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-y border-slate-200 text-center text-sm font-bold text-slate-500">
          {(['Posts', 'Replies', 'Media', 'Likes'] as ProfileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 transition hover:bg-slate-50 ${activeTab === tab ? 'border-b-2 border-teal-600 text-teal-700' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-200">
          {isLoadingPosts ? (
            <div className="px-6 py-14 text-center">
              <h3 className="text-lg font-black text-slate-950">Loading posts</h3>
              <p className="mt-2 text-sm text-slate-500">Fetching this profile&apos;s latest posts.</p>
            </div>
          ) : postsError ? (
            <div className="px-6 py-14 text-center">
              <h3 className="text-lg font-black text-slate-950">Activity unavailable</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{postsError}</p>
            </div>
          ) : activeTab === 'Replies' ? (
            profileReplies.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <h3 className="text-lg font-black text-slate-950">No replies yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{emptyTabMessage.Replies}</p>
              </div>
            ) : (
              profileReplies.map((reply) => (
                <article key={reply.id} className="bg-white p-4 transition hover:bg-slate-50/80 sm:p-6">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-slate-950 text-sm font-black text-white">
                      {getDisplayName(displayUser).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="truncate font-black text-slate-950">{displayName}</h3>
                        <span className="text-xs text-slate-400">replied {new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{reply.content}</p>
                      {reply.post && (
                        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                          <p className="text-xs font-bold text-slate-500">Replying to {getPostAuthorName(reply.post)}</p>
                          <h4 className="mt-2 text-base font-black leading-6 text-slate-950">{reply.post.title}</h4>
                          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {reply.post.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )
          ) : visiblePosts.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="text-lg font-black text-slate-950">No {activeTab.toLowerCase()} yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{emptyTabMessage[activeTab]}</p>
            </div>
          ) : (
            visiblePosts.map((post) => (
              <article key={post.id || post._id} className="bg-white p-4 transition hover:bg-slate-50/80 sm:p-6">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-slate-950 text-sm font-black text-white">
                    {getPostAuthorName(post).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="truncate font-black text-slate-950">{getPostAuthorName(post)}</h3>
                      <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</span>
                      {post.category && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                          <TagIcon className="h-3 w-3" />
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-3 text-lg font-black leading-6 text-slate-950">{post.title}</h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.content}</p>
                    {post.mediaUrl && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.mediaUrl}
                          alt={post.title}
                          className="max-h-96 w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-2">
                        <HeartIcon className="h-5 w-5" />
                        {post.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-2">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        {post.commentsCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;



