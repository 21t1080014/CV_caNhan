import axios from 'axios';
import { clearAuthSession, getStoredToken } from './auth';

const rawApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL = (() => {
    if (!rawApiBaseUrl) {
        return '/api';
    }

    const normalizedBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
    return normalizedBaseUrl.endsWith('/api')
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/api`;
})();

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthSession();

            const isLoginRequest = error.config?.url?.includes('/auth/login');
            if (!isLoginRequest && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
