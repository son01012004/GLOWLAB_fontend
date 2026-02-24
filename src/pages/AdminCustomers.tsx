import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Users, Mail, Phone, 
  ShieldCheck, User, MoreHorizontal, Loader2, MapPin
} from 'lucide-react';
import { message, Dropdown, type MenuProps, Button } from 'antd';
import { adminService } from '../services/admin.service';

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LẤY DANH SÁCH KHÁCH HÀNG TỪ BACKEND
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data: any = await adminService.getAllUsers();
      
      // Thuật toán bóc tách mảng an toàn (giống bên Đơn hàng)
      let usersArray = [];
      if (Array.isArray(data)) {
          usersArray = data;
      } else if (data?.content && Array.isArray(data.content)) {
          usersArray = data.content;
      } else if (data?.data && Array.isArray(data.data)) {
          usersArray = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
          usersArray = data.items;
      }
      
      setCustomers(usersArray);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // UI Component: Huy hiệu Phân quyền
  const getRoleBadge = (role: string) => {
    const r = (role || 'USER').toUpperCase();
    if (r.includes('ADMIN')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 text-[10px] font-black tracking-widest uppercase border border-purple-200/60 shadow-sm"><ShieldCheck size={14}/> QUẢN TRỊ VIÊN</span>;
    
    return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 text-[10px] font-black tracking-widest uppercase border border-gray-200/60 shadow-sm"><User size={14}/> KHÁCH HÀNG</span>;
  };

  // Tạo Avatar chữ cái đầu (Ví dụ: Nguyễn Văn A -> N)
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // BỘ LỌC TÌM KIẾM "BẤT TỬ"
  const filteredCustomers = customers.filter(c => {
    const searchVal = searchTerm.toLowerCase().trim();
    if (!searchVal) return true;
    const allData = JSON.stringify(Object.values(c)).toLowerCase();
    return allData.includes(searchVal);
  });

  return (
    <div className="space-y-8 pb-10 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>Quản lý Khách hàng</h1>
          <p className="text-gray-400 font-medium mt-1 text-sm">Danh sách tài khoản và thành viên của GLOWLAB.</p>
        </div>
        <button onClick={fetchCustomers} className="px-5 py-3 bg-white border border-gray-200 text-[#1E293B] rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
          LÀM MỚI DỮ LIỆU
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-[#86C2A1]/20 transition-all">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86C2A1] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Tên, Email hoặc Số điện thoại..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-transparent rounded-[1.5rem] focus:bg-gray-50 outline-none text-sm font-medium text-[#1E293B] transition-colors"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#86C2A1]" />
            <p className="font-bold tracking-wide">Đang tải danh sách người dùng...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Khách hàng</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Liên hệ</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Địa chỉ mặc định</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Quyền hạn</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCustomers.map((customer) => {
                    const items: MenuProps['items'] = [
                      { key: 'view', label: 'Xem chi tiết' },
                      { key: 'edit', label: 'Chỉnh sửa thông tin' },
                      { type: 'divider' },
                      { key: 'ban', label: <span className="text-red-500 font-bold">Khóa tài khoản</span> },
                    ];

                    const fullName = customer.fullName || customer.name || 'Thành viên GLOWLAB';

                    return (
                      <motion.tr 
                        key={customer.id || customer.email} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* 1. Thông tin cơ bản (Avatar + Tên) */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#1E293B] text-[#86C2A1] flex items-center justify-center text-lg font-black shrink-0 shadow-sm">
                              {getInitials(fullName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#1E293B]">{fullName}</span>
                              <span className="text-[11px] text-gray-400 font-medium mt-0.5">ID: {customer.id?.toString().substring(0,8) || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Thông tin liên hệ (Email + Phone) */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
                              <Mail size={14} className="text-gray-400" /> {customer.email || 'Chưa cập nhật'}
                            </div>
                            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
                              <Phone size={14} className="text-gray-400" /> {customer.phone || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </td>

                        {/* 3. Địa chỉ */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0 group-hover:text-[#86C2A1] transition-colors" />
                            <p className="text-[13px] font-medium text-gray-600 line-clamp-2 max-w-[200px]">
                              {customer.address || 'Chưa cập nhật địa chỉ'}
                            </p>
                          </div>
                        </td>

                        {/* 4. Quyền hạn (Role) */}
                        <td className="py-5 px-8 align-middle">
                          {getRoleBadge(customer.role)}
                        </td>

                        {/* 5. Thao tác */}
                        <td className="py-5 px-8 text-right align-middle">
                          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                            <Button className="border-transparent text-gray-400 hover:text-[#1E293B] hover:bg-gray-100 rounded-xl px-2 h-9 transition-all bg-transparent shadow-none">
                              <MoreHorizontal size={20} />
                            </Button>
                          </Dropdown>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredCustomers.length === 0 && !loading && (
              <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-inner">
                  <Users size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-black text-[#1E293B] tracking-tight">Không tìm thấy khách hàng</h3>
                <p className="text-gray-400 text-sm mt-2 font-medium">Thử lại với từ khóa khác hoặc chưa có dữ liệu hệ thống.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminCustomers;