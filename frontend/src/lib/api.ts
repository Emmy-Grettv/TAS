import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const baseURL = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl
  : `https://${rawUrl}`;

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
