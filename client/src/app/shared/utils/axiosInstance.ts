import axios from 'axios';

// Create an Axios instance for API calls
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // Set constant url to api/v1/
  withCredentials: true, // Important for cookies (refresh tokens)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // If you store the access token in localStorage or context, attach it here
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (e.g., for handling 401s and refresh tokens)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Placeholder for refresh token logic
    return Promise.reject(error);
  }
);
