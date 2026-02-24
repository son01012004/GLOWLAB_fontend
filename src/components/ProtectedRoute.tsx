import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { message } from 'antd';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Lấy thêm token dự phòng từ Local Storage
  const localToken = localStorage.getItem('token');

  // Điều kiện sống còn: Có Redux HOẶC có Token trong máy là được qua
  const isAuth = isAuthenticated || !!localToken;

  useEffect(() => {
    if (!isAuth) {
      message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    }
  }, [isAuth]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;