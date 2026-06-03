import api from './api';
import { PublicUser } from './user.service';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: PublicUser;
  recipient: PublicUser;
}

export interface Conversation {
  id: string;
  otherUser: PublicUser;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string | number;
  } | null;
  updatedAt: string;
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const findOrCreateConversation = async (
  recipientId: string | number,
): Promise<Conversation> => {
  const response = await api.post('/messages/conversations', { recipientId });
  return response.data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await api.get(`/messages/conversations/${conversationId}/messages`);
  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  content: string,
): Promise<Message> => {
  const response = await api.post(`/messages/conversations/${conversationId}/messages`, {
    content,
  });
  return response.data;
};
