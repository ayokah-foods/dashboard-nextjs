import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const base = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://apiamh.crosshubdigital.com/api/v1/admin',
  withCredentials: true,
});

const axiosInstance = setupCache(base, {
  ttl: 1000 * 60 * 60,  
  interpretHeader: false, 
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie
      .split('; ')
      .reduce((acc: Record<string, string>, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = decodeURIComponent(val);
        return acc;
      }, {});

    const token = cookies['token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
