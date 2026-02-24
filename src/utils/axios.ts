import axios from 'axios';

// Tạo một instance axios chuẩn
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL Backend của bạn
  timeout: 10000, // Timeout 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR REQUEST: Tự động nhét Token vào mọi Request gửi đi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE: Bắt lỗi tập trung (VD: Token hết hạn -> Tự động đăng xuất)
api.interceptors.response.use(
  (response) => response.data, // Chỉ lấy data, bỏ qua vỏ bọc của axios
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
      localStorage.removeItem('token');
      // Chuyển hướng về trang Login (sẽ setup ở bước Router)
      window.location.href = '/login'; 
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;