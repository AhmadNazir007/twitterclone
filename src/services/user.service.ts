import api from './api';

export type UserId = string | number;

export interface PublicUser {
  id: UserId;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  followersCount?: number;
  followingCount?: number;
}

export const getUser = async (userId: UserId): Promise<PublicUser> => {
  const response = await api.get(`/users/${userId}`);
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
