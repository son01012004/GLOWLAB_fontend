import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Bell } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', path: '/admin' },
    { icon: <Package size={20} />, label: 'Sản phẩm', path: '/admin/products' },
    { icon: <ShoppingBag size={20} />, label: 'Đơn hàng', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Khách hàng', path: '/admin/customers' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR FIXED */}
      <aside className="w-72 bg-[#1E293B] text-white flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black text-[#86C2A1]">GLOWLAB <span className="text-[10px] block text-gray-400 uppercase tracking-widest">Admin</span></h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                location.pathname === item.path 
                ? 'bg-[#86C2A1] text-[#1E293B] shadow-lg' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-6 py-4 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={20} /> Thoát
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-[#1E293B]">Quản trị viên</p>
                <p className="text-[10px] font-black text-[#86C2A1] uppercase">Premium Access</p>
             </div>
             <div className="w-10 h-10 bg-[#1E293B] text-[#86C2A1] rounded-xl flex items-center justify-center font-black shadow-lg">AD</div>
          </div>
        </header>
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;