import axios from 'axios';

// ---------------------------------------------------------------------------
// In-memory access token store
// Storing tokens in localStorage is vulnerable to XSS attacks. By keeping the
// access token only in module memory, it is inaccessible to injected scripts.
// The refresh token lives in an HttpOnly cookie set by the server.
// ---------------------------------------------------------------------------
let _accessToken = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token) => { _accessToken = token; },
  clear: () => { _accessToken = null; },
};

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true, // Sends the HttpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token from memory (never from localStorage)
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — handle 401 / 403 globally
// 401 = unauthenticated (no valid token)
// 403 = token expired
// ---------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Clear the in-memory token
      tokenStore.clear();

      // Redirect to login only when not already there to prevent loops
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
