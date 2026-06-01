// src/services/posts.ts
import api from './api';
import type { PublicUser, UserId } from './user.service';

// No need to create a new axios instance here; the shared api includes base URL and auth headers.

export interface PostCategory {
  id: string;
  name: string;
}

export interface PostAuthor extends Pick<PublicUser, 'id' | '_id' | 'name' | 'username' | 'email' | 'avatarUrl'> {
  avatar?: string;
}

export interface Post {
  id: string;
  _id?: string;
  title: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  category?: PostCategory | null;
  likesCount?: number;
  commentsCount?: number;
  author: PostAuthor;
}

export interface PostReply {
  id: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
  post: Post;
}

export const getUserPosts = async (userId: UserId): Promise<Post[]> => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

export const getUserReplies = async (userId: UserId): Promise<PostReply[]> => {
  const response = await api.get(`/posts/user/${userId}/replies`);
  return response.data;
};

export const getUserLikedPosts = async (userId: UserId): Promise<Post[]> => {
  const response = await api.get(`/posts/user/${userId}/likes`);
  return response.data;
};

export const getPost = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const addComment = async (postId: string, content: string) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response.data;
};

export const toggleLike = async (postId: string) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};
