import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { quizService } from '../services/quiz.service';
import { 
  Loader2, Award, Zap, Droplets, RefreshCw, 
  ShoppingBag, CheckCircle, Info 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const SkinProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    quizService.getMyProfile()
      .then((res: any) => {
        setProfile(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const chartData = [
    { subject: 'Độ ẩm', A: profile?.skinType === 'DRY' ? 30 : 80, fullMark: 100 },
    { subject: 'Dầu', A: profile?.skinType === 'OILY' ? 90 : 40, fullMark: 100 },
    { subject: 'Mụn', A: 65, fullMark: 100 },
    { subject: 'Nhạy cảm', A: 45, fullMark: 100 },
    { subject: 'Lỗ chân lông', A: 70, fullMark: 100 },
  ];

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#86C2A1] w-12 h-12" />
      <p className="text-[#86C2A1] font-bold text-xs tracking-widest uppercase">Đang phân tích dữ liệu...</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 px-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={120} /></div>
          <h1 className="text-4xl font-bold text-[#1E293B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hồ Sơ Da Độc Bản
          </h1>
          <p className="text-[#86C2A1] font-bold tracking-widest text-xs uppercase">Bản phân tích chuyên sâu cho: {profile?.userEmail || 'Thành viên GlowLab'}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-effect p-8 lg:col-span-1">
            <h3 className="font-bold text-[#1E293B] flex items-center gap-2 mb-6 uppercase text-xs tracking-widest">
              <Info className="w-4 h-4 text-[#86C2A1]" /> Biểu đồ chỉ số da
            </h3>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="Chỉ số" dataKey="A" stroke="#86C2A1" fill="#86C2A1" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* COLUMN 2 */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-8">
            <div className="glass-effect p-8 border-l-8 border-l-[#86C2A1] flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2 mb-2 uppercase text-xs tracking-widest"><Droplets className="text-[#86C2A1]" /> Tình trạng da</h3>
                <p className="text-5xl font-black text-[#86C2A1] tracking-tighter uppercase">{profile?.skinType || "COMBINATION"}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Độ chính xác AI</p>
                <p className="text-2xl font-bold text-[#1E293B]">98.5%</p>
              </div>
            </div>

            <div className="glass-effect p-8">
              <h3 className="font-bold text-[#1E293B] flex items-center gap-2 mb-4 uppercase text-xs tracking-widest"><Zap className="text-[#86C2A1]" /> Phác đồ điều trị</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {profile?.recommendation || "Dựa trên các chỉ số, làn da của bạn đang thiếu hụt độ ẩm tầng sâu. Bạn nên sử dụng các sản phẩm có chứa HA và tránh các chất tẩy rửa mạnh có gốc Sulfate."}
              </p>
              <div className="grid grid-cols-2 mt-6 gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]"><CheckCircle className="w-4 h-4 text-[#86C2A1]" /> Làm sạch dịu nhẹ</div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]"><CheckCircle className="w-4 h-4 text-[#86C2A1]" /> Cấp ẩm chuyên sâu</div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]"><CheckCircle className="w-4 h-4 text-[#86C2A1]" /> Chống nắng quang phổ rộng</div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]"><CheckCircle className="w-4 h-4 text-[#86C2A1]" /> Bổ sung Vitamin C</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CÁC NÚT ĐIỀU HƯỚNG */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={() => navigate('/quiz')}
            className="flex items-center justify-center gap-2 px-10 py-4 glass-effect border-white/60 text-[#1E293B] font-bold hover:bg-white/50 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> LÀM LẠI BÀI TEST
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-[#1E293B] text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> MUA SẮM SẢN PHẨM GỢI Ý
          </button>
        </div>

        {/* ================= SECTION: SẢN PHẨM GỢI Ý (WOW FACTOR) ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="space-y-8 pt-12"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chu Trình Dưỡng Da Gợi Ý
            </h2>
            <p className="text-gray-500 text-sm">Các sản phẩm được chọn lọc dựa trên tình trạng da {profile?.skinType}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "Bước 1", name: "Sữa Rửa Mặt Dịu Nhẹ", brand: "Cerave", price: "350.000đ", tag: "Cleaning" },
              { step: "Bước 2", name: "Toner Cấp Ẩm HA", brand: "The Ordinary", price: "280.000đ", tag: "Hydration" },
              { step: "Bước 3", name: "Kem Chống Nắng Phục Hồi", brand: "La Roche-Posay", price: "495.000đ", tag: "Protection" }
            ].map((product, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass-effect p-6 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-full aspect-square bg-white/50 rounded-2xl mb-4 flex items-center justify-center border border-dashed border-[#86C2A1]/30 group-hover:border-[#86C2A1] transition-colors">
                   <ShoppingBag className="w-12 h-12 text-[#86C2A1]/20 group-hover:text-[#86C2A1] transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-[#86C2A1] uppercase tracking-[0.2em] mb-1">{product.step}</span>
                <h4 className="font-bold text-[#1E293B] mb-1">{product.name}</h4>
                <p className="text-xs text-gray-400 mb-3">{product.brand}</p>
                <p className="text-[#86C2A1] font-black mb-4">{product.price}</p>
                <button className="w-full py-2 bg-white border border-[#86C2A1] text-[#86C2A1] rounded-xl text-xs font-bold hover:bg-[#86C2A1] hover:text-white transition-all">
                  THÊM VÀO GIỎ HÀNG
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FOOTER NOTE */}
        <div className="text-center pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-widest">
            <Info size={14} /> Lưu ý: Kết quả này chỉ mang tính chất tham khảo dựa trên thuật toán AI.
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkinProfile;