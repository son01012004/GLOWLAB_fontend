import api from '../utils/axios';

export const authService = {
  // Hàm gọi API Đăng nhập
  login: async (credentials: any) => {
    // Gọi POST http://localhost:8080/api/v1/auth/login
    const response = await api.post('/auth/login', credentials);
    return response; 
  },

  // Hàm gọi API Đăng ký
  register: async (data: any) => {
    // Gọi POST http://localhost:8080/api/v1/auth/register
    const response = await api.post('/auth/register', data);
    return response;
  }
};