// hooks/useSocket.ts
import { useEffect } from 'react';
import  io  from 'socket.io-client';
import { toast } from 'react-toastify';

export const useSocket = () => {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) return;
    if (process.env.NEXT_PUBLIC_ENABLE_SOCKET?.toLowerCase() === 'false') {
      console.log('Socket.IO disabled by NEXT_PUBLIC_ENABLE_SOCKET=false');
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    type NotificationData = {
      message: string;
      [key: string]: unknown;
    };

    socket.on('notification', (data: NotificationData) => {
      console.log('Notification Alert:', data);
      toast.info(data.message);
    });
  }, []);
};
