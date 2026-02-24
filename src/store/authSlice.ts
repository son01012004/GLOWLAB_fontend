import { createSlice } from '@reduxjs/toolkit';

// 1. Lấy token từ ổ cứng ngay khi app vừa chạy lên
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  // 2. Nếu có token trong máy -> tự động cho phép đăng nhập
  isAuthenticated: !!tokenFromStorage, 
  token: tokenFromStorage,
  // user: ... (nếu có)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token'); // Nhớ xóa token khi đăng xuất
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;