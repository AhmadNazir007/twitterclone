// src/services/posts.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
