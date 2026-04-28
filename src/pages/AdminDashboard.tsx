import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Package, ShoppingBag, Users,
  ArrowUpRight, TrendingUp, Calendar,
  ChevronRight, MoreVertical
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

// Mock data cho biểu đồ doanh thu
const revenueData = [
  { name: 'Th 9', total: 45000000 },
  { name: 'Th 10', total: 52000000 },
  { name: 'Th 11', total: 48000000 },
  { name: 'Th 12', total: 61000000 },
  { name: 'Th 1', total: 55000000 },
  { name: 'Th 2', total: 128500000 },
];

const AdminDashboard: React.FC = () => {

  const stats = [
    { label: 'Doanh thu tháng', value: '128.500.000 đ', icon: <DollarSign />, color: '#3B82F6', trend: '+24%', desc: 'So với tháng trước' },
    { label: 'Đơn hàng mới', value: '45', icon: <ShoppingBag />, color: '#F97316', trend: '+12%', desc: 'Đang chờ xử lý' },
    { label: 'Sản phẩm', value: '120', icon: <Package />, color: '#10B981', trend: 'Ổn định', desc: 'Sẵn sàng trong kho' },
    { label: 'Khách hàng', value: '1,250', icon: <Users />, color: '#8B5CF6', trend: '+18%', desc: 'Thành viên mới' },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="text-4xl font-black text-[#1E293B]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Bảng Điều Khiển
          </h1>
          <div className="flex items-center gap-2 text-gray-400 font-medium mt-1">
            <Calendar size={14} />
            <span className="text-xs">Dữ liệu cập nhật: 24/02/2026</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-[#1E293B] rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
            Lọc dữ liệu
          </button>
          <button className="px-5 py-2.5 bg-[#1E293B] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#86C2A1] transition-all">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-50" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{
                    backgroundColor: stat.color,
                    boxShadow: `0 8px 16px ${stat.color}33`
                  }}
                >
                  {stat.icon}
                </div>

                <span className="flex items-center gap-0.5 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} /> {stat.trend}
                </span>
              </div>

              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">
                {stat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CHART */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-[#1E293B]">
                Biểu đồ Doanh thu
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Theo dõi tăng trưởng 6 tháng gần nhất
              </p>
            </div>
            <TrendingUp className="text-[#86C2A1]" size={24} />
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#86C2A1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#86C2A1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />

                <YAxis hide />

                {/* ✅ FIX TYPE 2322 Ở ĐÂY */}
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }}
                  formatter={(value: number | string | undefined) => {
                    const num = Number(value ?? 0);
                    return [
                      `${num.toLocaleString('vi-VN')} đ`,
                      'Doanh thu'
                    ];
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#86C2A1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="bg-[#1E293B] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#86C2A1]/10 blur-[80px] rounded-full" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Đơn hàng mới</h3>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
              {[
                { name: 'Nguyễn Minh Tú', price: '4.375.000 đ', time: 'Vừa xong', status: 'VNPay' },
                { name: 'Trần Hoàng Oanh', price: '1.250.000 đ', time: '12 phút trước', status: 'COD' },
                { name: 'Lê Hải Đăng', price: '875.000 đ', time: '45 phút trước', status: 'VNPay' },
                { name: 'Phạm Thu Thảo', price: '2.100.000 đ', time: '2 giờ trước', status: 'VNPay' },
              ].map((order, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-white/5 rounded-2xl transition-all"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-[#86C2A1] group-hover:scale-110 transition-transform">
                    {order.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {order.name}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {order.status} • {order.time}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-[#86C2A1]">
                      {order.price}
                    </p>
                    <ChevronRight size={14} className="ml-auto text-gray-500 mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-4 bg-white/10 hover:bg-[#86C2A1] hover:text-[#1E293B] rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all">
              Tất cả đơn hàng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;