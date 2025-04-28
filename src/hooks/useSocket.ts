// hooks/useSocket.ts
import { useEffect } from 'react';
import  io  from 'socket.io-client';

export const useSocket = () => {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!); // backend URL

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    type NotificationData = {
			message: string;
			[key: string]: unknown;
		};

		socket.on('notification', (data: NotificationData) => {
			console.log('Notification Alert:', data);
			alert(`🔔 ${data.message}`);
		});

    return () => {
      socket.disconnect();
    };
  }, []);
};
