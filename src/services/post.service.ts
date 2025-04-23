// src/services/posts.ts
import axios from 'axios';

export const getPost = async (postId: string) => {
  const response = await axios.get(`/api/posts/${postId}`);
  return response.data;
};

export const addComment = async (postId: string, content: string) => {
  const response = await axios.post(`/api/posts/${postId}/comments`, { content });
  return response.data;
};

export const toggleLike = async (postId: string) => {
  const response = await axios.post(`/api/posts/${postId}/like`);
  return response.data;
};