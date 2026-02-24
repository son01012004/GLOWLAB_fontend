import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, LogOut, ChevronRight, 
  MapPin, Phone, Mail, Clock, CheckCircle2, Truck 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'; // Giả sử bạn có action logout
import { message } from 'antd';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');

  // Mock data đơn hàng (Sau này bạn fetch từ API /api/v1/orders/user)
  const mockOrders = [
    { id: 'cbffec1d-9955', date: '24/02/2026', total: 4375000, status: 'DELIVERED', items: 3 },
    { id: 'a765-00a0c91e', date: '10/01/2026', total: 875000, status: 'PROCESSING', items: 1 },
  ];

  const handleLogout = () => {
    dispatch(logout()); // Xóa token trong Redux
    message.success("Đã đăng xuất thành công!");
    navigate('/login');
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'DELIVERED': return { color: 'text-green-500 bg-green-50', icon: <CheckCircle2 size={16}/>, text: 'Đã giao hàng' };
      case 'SHIPPING': return { color: 'text-blue-500 bg-blue-50', icon: <Truck size={16}/>, text: 'Đang vận chuyển' };
      default: return { color: 'text-yellow-600 bg-yellow-50', icon: <Clock size={16}/>, text: 'Đang xử lý' };
    }
  };

  return (
    <div className="relative min-h-screen pt-32 px-4 md:px-8 pb-20 overflow-hidden isolate bg-[#fcfcfc]">
      
      {/* BACKGROUND DECOR GLOWLAB */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8fffb] via-[#fcfcfc] to-[#eef7f1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#86C2A1]/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#1E293B] text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User size={40} />
            </div>
            <h2 className="text-xl font-black text-[#1E293B]">Khách Hàng V.I.P</h2>
            <p className="text-xs font-bold text-[#86C2A1] tracking-widest uppercase mt-1">GlowLab Member</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white p-4 rounded-[2.5rem] shadow-sm flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'orders' ? 'bg-[#1E293B] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Package size={20} /> Đơn hàng của tôi
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'profile' ? 'bg-[#1E293B] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <User size={20} /> Thông tin cá nhân
            </button>
            <div className="h-px bg-gray-100 my-2 mx-4" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={20} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            
            {/* TAB LỊCH SỬ ĐƠN HÀNG */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h3 className="text-3xl font-black text-[#1E293B] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Lịch Sử Đơn Hàng</h3>
                
                {mockOrders.length > 0 ? (
                  <div className="space-y-4">
                    {mockOrders.map((order, idx) => {
                      const status = getStatusDisplay(order.status);
                      return (
                        <div key={idx} className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">MÃ ĐƠN: #{order.id}</span>
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${status.color}`}>
                                {status.icon} {status.text}
                              </div>
                            </div>
                            <p className="text-sm font-bold text-[#1E293B]">Đặt ngày: {order.date}</p>
                            <p className="text-sm text-gray-500 mt-1">{order.items} sản phẩm</p>
                          </div>
                          
                          <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                            <span className="text-2xl font-black text-[#86C2A1]">
                              {new Intl.NumberFormat('vi-VN').format(order.total)} đ
                            </span>
                            <button className="flex items-center gap-1 text-xs font-bold text-[#1E293B] hover:text-[#86C2A1] transition-colors">
                              Xem chi tiết <ChevronRight size={16}/>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-[3rem] border border-white">
                    <p className="text-gray-500 font-medium">Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => navigate('/shop')} className="mt-4 text-[#86C2A1] font-bold underline">Mua sắm ngay</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB THÔNG TIN CÁ NHÂN */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-black text-[#1E293B] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Thông Tin Cá Nhân</h3>
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[3rem] shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Họ và Tên</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-[#1E293B]">
                        <User size={18} className="text-[#86C2A1]"/> Khách Hàng V.I.P
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-[#1E293B]">
                        <Mail size={18} className="text-[#86C2A1]"/> customer@glowlab.com
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-[#1E293B]">
                        <Phone size={18} className="text-[#86C2A1]"/> 0912 345 678
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Địa chỉ mặc định</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-[#1E293B]">
                        <MapPin size={18} className="text-[#86C2A1]"/> Quận 1, TP.HCM
                      </div>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-[#1E293B] text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-[#86C2A1] transition-colors shadow-lg">
                    Cập nhật thông tin
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;