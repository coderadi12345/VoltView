import { useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

export const useSocket = (handlers = {}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.organization) return undefined;

    const socket = getSocket();
    socket.connect();
    socket.emit('organization:join', user.organization);

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
      socket.disconnect();
    };
  }, [user?.organization, handlers]);
};
