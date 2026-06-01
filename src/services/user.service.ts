import api from './api';

export type UserId = string | number;

export interface PublicUser {
  id: UserId;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  bio?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export const getUser = async (userId: UserId): Promise<PublicUser> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getMe = async (): Promise<PublicUser> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (payload: UpdateProfilePayload): Promise<PublicUser> => {
  const response = await api.patch('/users/me', payload);
  return response.data;
};

export const getFollowSuggestions = async (): Promise<PublicUser[]> => {
  const response = await api.get('/users/suggestions');
  return response.data;
};

export const followUser = async (userId: UserId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: UserId) => {
  const response = await api.post(`/users/${userId}/unfollow`);
  return response.data;
};

export const checkIsFollowing = async (userId: UserId): Promise<boolean> => {
  const response = await api.get(`/users/${userId}/is-following`);
  return Boolean(response.data?.isFollowing);
};

export const getFollowers = async (userId: UserId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: UserId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};
