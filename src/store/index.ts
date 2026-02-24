import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice'; // 1. THÊM DÒNG NÀY

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // 2. THÊM DÒNG NÀY
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;