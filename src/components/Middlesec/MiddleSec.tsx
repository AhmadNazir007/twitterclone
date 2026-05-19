'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { AppIcons } from '@/app/assets';
import type { RootState } from '../../../store';

type DisplayUser = {
  id?: string | number;
  _id?: string;
  username?: string;
  name?: string;
  email?: string;
};

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likes?: {
    id: string;
    user: {
      id?: string | number;
      _id?: string;
    };
  }[];
  likesCount: number;
  likedByUser?: boolean;
  comments?: {
    id: string;
    content: string;
    author: {
      id?: string | number;
      username?: string;
      name?: string;
      email?: string;
    };
    createdAt: string;
  }[];
  commentsCount: number;
  author: {
    _id?: string;
    id?: string | number;
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

const MiddleSec = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [postData, setPostData] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const currentDisplayName = useMemo(
    () => currentUser?.name || currentUser?.username || currentUser?.email || 'You',
    [currentUser],
  );

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const getUserId = (user?: { id?: string | number; _id?: string } | null) =>
    user?.id !== undefined ? String(user.id) : user?._id || '';

  const getUserName = (user?: DisplayUser) =>
    user?.name || user?.username || user?.email || 'Pulse user';

  const isOwnPost = (post: Post) =>
    Boolean(currentUser && getUserId(post.author) === getUserId(currentUser));

  const isLikedByCurrentUser = (post: Post) => {
    if (typeof post.likedByUser === 'boolean') return post.likedByUser;
    const currentUserId = getUserId(currentUser);
    return Boolean(
      currentUserId && post.likes?.some((like) => getUserId(like.user) === currentUserId),
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePost = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!postData.title.trim() || !postData.content.trim()) {
      toast.error('Both title and content are required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to post');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      toast.success('Post created successfully');
      setPostData({ title: '', content: '' });
      fetchPosts();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to delete posts');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLikePost = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to like posts');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to toggle like');

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: data.liked,
                likesCount: data.liked
                  ? (post.likesCount || 0) + 1
                  : Math.max((post.likesCount || 0) - 1, 0),
              }
            : post,
        ),
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  const handleAddComment = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to comment');
      return;
    }

    const content = commentInputs[postId]?.trim();
    if (!content) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const newComment = await response.json();
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
                commentsCount: (post.commentsCount || 0) + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const startEditing = (post: Post) => {
    setEditingPostId(post.id);
    setEditData({ title: post.title, content: post.content });
  };

  const handleUpdatePost = async (postId: string) => {
    if (!editData.title.trim() || !editData.content.trim()) {
      toast.error('Both title and content are required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to update posts');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update post');

      toast.success('Post updated successfully');
      setEditingPostId(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Home</p>
            <h1 className="text-2xl font-black text-slate-950">Latest pulses</h1>
          </div>
          <button
            onClick={fetchPosts}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
          >
            Refresh
          </button>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-slate-950 text-sm font-black text-white">
            {currentDisplayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <input
              name="title"
              placeholder="Give it a title"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-950 outline-none ring-teal-500/20 transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4"
              value={postData.title}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <textarea
              name="content"
              placeholder="What's happening?"
              className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none ring-teal-500/20 transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4"
              value={postData.content}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-teal-600">
                <PhotoIcon className="h-5 w-5" />
                <span className="text-xs font-semibold">Media tools ready for upload APIs</span>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!postData.title.trim() || !postData.content.trim() || isLoading}
                className="h-11 rounded-full bg-slate-950 px-6 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="divide-y divide-slate-200">
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <PencilSquareIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-lg font-black text-slate-950">No posts yet</h2>
            <p className="mt-2 text-sm text-slate-500">Start the conversation with your first post.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="bg-white p-4 transition hover:bg-slate-50/80 sm:p-6">
              {editingPostId === post.id ? (
                <div className="space-y-3">
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditInputChange}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 font-bold outline-none ring-teal-500/20 focus:ring-4"
                  />
                  <textarea
                    name="content"
                    value={editData.content}
                    onChange={handleEditInputChange}
                    className="min-h-28 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none ring-teal-500/20 focus:ring-4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="h-10 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdatePost(post.id)}
                      className="h-10 rounded-full bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-3">
                    <Image
                      src={AppIcons.avatar_medium}
                      alt="User avatar"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="truncate font-black text-slate-950">{getUserName(post.author)}</h3>
                        <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                      <h4 className="mt-3 text-lg font-black leading-6 text-slate-950">{post.title}</h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.content}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-14">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        {isLikedByCurrentUser(post) ? (
                          <HeartFilled className="h-5 w-5 text-rose-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        {post.likesCount || 0}
                      </button>
                      <button
                        onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        {post.commentsCount || 0}
                      </button>
                    </div>
                    {isOwnPost(post) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(post)}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                          title="Edit post"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                          title="Delete post"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {expandedComments[post.id] && (
                    <div className="mt-5 space-y-4 pl-0 sm:pl-14">
                      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-500/20">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Add a thoughtful reply"
                          className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800"
                        >
                          Reply
                        </button>
                      </div>
                      {(post.comments || []).length > 0 ? (
                        <div className="space-y-3">
                          {(post.comments || []).map((comment) => (
                            <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-900">{getUserName(comment.author)}</span>
                                <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="mt-1 text-sm leading-6 text-slate-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No replies yet.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default MiddleSec;


