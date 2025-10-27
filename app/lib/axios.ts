// lib/axios.ts
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const base = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.africanmarkethub.ca/api/v1/admin',
  withCredentials: true, // ❌ disable cookies
});

const axiosInstance = setupCache(base, {
  ttl: 1000 * 60 * 60,
  interpretHeader: false,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); // store token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
