import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { message } from 'antd';

const AdminRoute: React.FC = () => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // BỌC THÔNG BÁO VÀO USE-EFFECT
  useEffect(() => {
    if (!isAuthenticated || !token) {
      message.error("Vui lòng đăng nhập với quyền Quản trị viên!");
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;