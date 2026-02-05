"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io("https://contact-support.onrender.com", {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    newSocket.on('connect', () => console.log('Socket connected'));
    newSocket.on('disconnect', (reason) => console.log('Disconnected:', reason));
    newSocket.on('connect_error', (error) => console.error('Connection error:', error));

    setSocket(newSocket);

    return () => { newSocket.disconnect(); };
  }, []);

  return socket;
};