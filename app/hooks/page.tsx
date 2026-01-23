import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io("http://localhost:3001", {
      auth: { token }
    });

    setSocket(newSocket);

    return () => { newSocket.disconnect(); };
  }, []);

  return socket;
};