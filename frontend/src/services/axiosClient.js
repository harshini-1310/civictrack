import axios from 'axios';

const normalizeApiUrl = (rawUrl) => {
  const value = (rawUrl || '').trim();

  if (!value) {
    return '/api';
  }

  // Support shorthand values like ':5000/api'.
  if (value.startsWith(':')) {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}${value}`;
    }

    return value;
  }

  // Support host-based values without protocol.
  if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('/')) {
    return `http://${value}`;
  }

  return value;
};

const isAbsoluteUrl = (url) => url.startsWith('http://') || url.startsWith('https://');

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const getBackendBaseUrl = () => {
  if (isAbsoluteUrl(API_URL)) {
    const parsed = new URL(API_URL);
    return `${parsed.protocol}//${parsed.host}`;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

export const getUploadUrl = (filename) => `${getBackendBaseUrl()}/uploads/${encodeURIComponent(filename)}`;

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData - let axios/browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin-login';
    }

    if (!error.response) {
      error.message = 'Unable to connect to backend server. Ensure backend is running and API URL is configured correctly.';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
