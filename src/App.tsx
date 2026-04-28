import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang của bạn
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import SkinProfile from './pages/SkinProfile';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';

// THÊM CÁC TRANG ADMIN
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';

// Import Component Bảo vệ Route
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <>
      {/* Background Decor (Giữ nguyên của bạn) */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Routes>
          {/* ======================================= */}
          {/* CÁC TRANG CÔNG KHAI (Ai cũng xem được)  */}
          {/* ======================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* ======================================= */}
          {/* CÁC TRANG BẢO MẬT (Bắt buộc đăng nhập) */}
          {/* ======================================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/skin-profile" element={<SkinProfile />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/my-account" element={<ProfilePage />} />
          </Route>

          {/* ======================================= */}
          {/* HỆ THỐNG QUẢN TRỊ ADMIN (THÊM MỚI)      */}
          {/* ======================================= */}
          <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
            {/* Thêm các trang quản lý khác ở đây */} 
          </Route>
          </Route>

          {/* Bắt lỗi 404: Tránh màn hình trắng nếu khách gõ sai đường link */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;