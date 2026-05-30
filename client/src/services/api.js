import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voltview_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = localStorage.getItem('voltview_refresh_token');
    const original = error.config;

    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      localStorage.setItem('voltview_access_token', data.data.accessToken);
      localStorage.setItem('voltview_refresh_token', data.data.refreshToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export const unwrap = (promise) => promise.then((response) => response.data.data);
