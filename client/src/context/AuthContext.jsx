import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, unwrap } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('voltview_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    unwrap(api.get('/auth/me'))
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('voltview_access_token');
        localStorage.removeItem('voltview_refresh_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await unwrap(api.post('/auth/login', credentials));
    localStorage.setItem('voltview_access_token', data.accessToken);
    localStorage.setItem('voltview_refresh_token', data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await unwrap(api.post('/auth/register', userData));
    localStorage.setItem('voltview_access_token', data.accessToken);
    localStorage.setItem('voltview_refresh_token', data.refreshToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('voltview_access_token');
      localStorage.removeItem('voltview_refresh_token');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
