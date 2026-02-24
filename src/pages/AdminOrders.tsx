import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileText, CheckCircle2, 
  Loader2, Truck, PackageX, Clock, MapPin, Package, ChevronDown
} from 'lucide-react';
import { message, Dropdown, type MenuProps, Button } from 'antd';
import { adminService } from '../services/admin.service';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data: any = await adminService.getAllOrders();
      let ordersArray = [];
      if (Array.isArray(data)) {
          ordersArray = data;
      } else if (data?.content && Array.isArray(data.content)) {
          ordersArray = data.content;
      } else if (data?.data && Array.isArray(data.data)) {
          ordersArray = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
          ordersArray = data.items;
      }
      
      // FIX LỖI Ở ĐÂY: Thêm :any cho a và b
      ordersArray.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      setOrders(ordersArray);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      message.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái!");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s.includes('PENDING') || s.includes('CHỜ')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-600 text-[10px] font-black tracking-widest uppercase border border-yellow-200/60 shadow-sm"><Clock size={14}/> Chờ xử lý</span>;
    if (s.includes('PROCESSING') || s.includes('ĐANG')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase border border-blue-200/60 shadow-sm"><Loader2 size={14} className="animate-spin"/> Chuẩn bị hàng</span>;
    if (s.includes('SHIPP') || s.includes('GIAO')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 text-[10px] font-black tracking-widest uppercase border border-purple-200/60 shadow-sm"><Truck size={14}/> Đang giao</span>;
    if (s.includes('DELIVERED') || s.includes('COMPLETED') || s.includes('THÀNH CÔNG')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-[10px] font-black tracking-widest uppercase border border-green-200/60 shadow-sm"><CheckCircle2 size={14}/> Hoàn thành</span>;
    if (s.includes('CANCEL') || s.includes('HỦY')) 
      return <span className="flex items-center gap-1.5 w-max px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-[10px] font-black tracking-widest uppercase border border-red-200/60 shadow-sm"><PackageX size={14}/> Đã hủy</span>;
    
    return <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black tracking-widest uppercase border border-gray-200 shadow-sm">{status}</span>;
  };

  const filteredOrders = orders.filter(o => {
    const searchVal = searchTerm.toLowerCase().trim();
    if (!searchVal) return true;
    const allData = JSON.stringify(Object.values(o)).toLowerCase();
    return allData.includes(searchVal);
  });

  return (
    <div className="space-y-8 pb-10 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>Quản lý Đơn hàng</h1>
          <p className="text-gray-400 font-medium mt-1 text-sm">Theo dõi và cập nhật tiến trình giao hàng.</p>
        </div>
        <button onClick={fetchOrders} className="px-5 py-3 bg-white border border-gray-200 text-[#1E293B] rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2">
          LÀM MỚI DỮ LIỆU
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-[#86C2A1]/20 transition-all">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86C2A1] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Mã đơn, Địa chỉ hoặc Tên Sản phẩm..." 
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
            <p className="font-bold tracking-wide">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Mã Đơn / Ngày đặt</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Địa chỉ giao hàng</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Sản phẩm</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Tổng tiền</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Trạng thái</th>
                  <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order) => {
                    const items: MenuProps['items'] = [
                      { key: 'PENDING', label: 'Chờ xử lý', onClick: () => handleUpdateStatus(order.id, 'PENDING') },
                      { key: 'PROCESSING', label: 'Đang chuẩn bị', onClick: () => handleUpdateStatus(order.id, 'PROCESSING') },
                      { key: 'SHIPPED', label: 'Đang giao hàng', onClick: () => handleUpdateStatus(order.id, 'SHIPPED') },
                      { key: 'DELIVERED', label: 'Đã giao thành công', onClick: () => handleUpdateStatus(order.id, 'DELIVERED') },
                      { type: 'divider' },
                      { key: 'CANCELLED', label: <span className="text-red-500 font-bold">Hủy đơn hàng</span>, onClick: () => handleUpdateStatus(order.id, 'CANCELLED') },
                    ];

                    const orderDate = order.createdAt 
                      ? new Date(order.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                      : 'Không rõ ngày';

                    const firstItem = order.items?.[0];

                    return (
                      <motion.tr 
                        key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* 1. Mã đơn & Ngày */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#86C2A1] bg-[#86C2A1]/10 px-2 py-1 rounded-md w-max mb-1">
                              #{order.id?.toString().substring(0, 8)}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">{orderDate}</span>
                          </div>
                        </td>

                        {/* 2. Địa chỉ */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0 group-hover:text-[#86C2A1] transition-colors" />
                            <p className="text-sm font-bold text-[#1E293B] line-clamp-2 max-w-[220px]">
                              {order.shippingAddress || 'Khách hàng nhận tại cửa hàng'}
                            </p>
                          </div>
                        </td>

                        {/* 3. Tóm tắt Sản phẩm (CÓ ẢNH MINH HỌA) */}
                        <td className="py-5 px-8 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                              {firstItem?.productImageUrl ? (
                                <img src={firstItem.productImageUrl} alt={firstItem.productName} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={18} className="text-gray-300" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#1E293B] truncate max-w-[180px]" title={firstItem?.productName}>
                                {firstItem ? firstItem.productName : 'Đơn hàng trống'}
                              </span>
                              <span className="text-[11px] text-gray-400 mt-0.5 font-bold">
                                {order.items && order.items.length > 1 
                                  ? `+${order.items.length - 1} sản phẩm khác` 
                                  : (firstItem ? `Số lượng: ${firstItem.quantity}` : '')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Tổng tiền */}
                        <td className="py-5 px-8 align-middle">
                          <span className="text-sm font-black text-[#1E293B]">
                            {new Intl.NumberFormat('vi-VN').format(order.totalAmount || 0)} đ
                          </span>
                        </td>

                        {/* 5. Trạng thái */}
                        <td className="py-5 px-8 align-middle">
                          {getStatusBadge(order.status)}
                        </td>

                        {/* 6. Cập nhật */}
                        <td className="py-5 px-8 text-right align-middle">
                          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                            <Button loading={actionLoading === order.id} className="flex items-center justify-center gap-2 border-gray-200 text-[11px] font-bold text-gray-500 hover:text-[#86C2A1] hover:border-[#86C2A1] rounded-xl px-4 h-9 transition-all bg-white ml-auto shadow-sm">
                              CẬP NHẬT <ChevronDown size={14} />
                            </Button>
                          </Dropdown>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && !loading && (
              <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-inner">
                  <FileText size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-black text-[#1E293B] tracking-tight">Chưa có đơn hàng nào</h3>
                <p className="text-gray-400 text-sm mt-2 font-medium">Bạn có thể quay lại sau khi khách hàng thực hiện thanh toán.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOrders;