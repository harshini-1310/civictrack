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
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${value}`;
    }

    return `https://${value}`;
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

// Add token to requests (only for protected endpoints)
axiosClient.interceptors.request.use(
  (config) => {
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
      '/complaints/',          // POST - create public complaint
      '/complaints/track',     // GET - track complaint status
      '/complaints/update',    // PUT - update complaint details
      '/auth/register',        // POST - admin registration
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => {
      // Handle both exact matches and prefix matches
      return config.url.includes(endpoint) || config.url === endpoint.slice(0, -1);
    });

    // Only add token for protected endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      localStorage.removeItem('token');
      window.location.href = '/admin-login';
    }

    // Improve error handling - log actual backend response
    if (!error.response) {
      // Network error or timeout
      console.error('Network error:', error.message);
      error.message = 'Unable to connect to backend server. Ensure backend is running and API URL is configured correctly.';
    } else {
      // Backend returned an error response
      console.error('Backend error response:', {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
