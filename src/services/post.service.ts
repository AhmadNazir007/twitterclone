// src/services/posts.ts
import api from './api';

// No need to create a new axios instance here; the shared api includes base URL and auth headers.

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
