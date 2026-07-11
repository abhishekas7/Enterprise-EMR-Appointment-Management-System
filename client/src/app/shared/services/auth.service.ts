import { axiosInstance } from '../utils/axiosInstance';

export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/v1/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/api/v1/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/api/v1/auth/me');
    return response.data;
  }
};
