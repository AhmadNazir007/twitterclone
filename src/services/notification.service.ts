import api from './api';

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await api.get('/notifications');
  return response.data;
};
