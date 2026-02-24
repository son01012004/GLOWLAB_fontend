import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Sửa lỗi 'RootState' bằng cách thêm từ khóa 'type' ở đây
import type { RootState } from '../store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen relative">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-effect !rounded-none border-none px-8 py-5 flex justify-between items-center bg-white/40 backdrop-blur-xl">
        <div 
          className="text-3xl font-bold text-[#1E293B] tracking-[0.2em] cursor-pointer" 
          style={{ fontFamily: "'Playfair Display', serif" }}
          onClick={() => navigate('/')}
        >
          GLOWLAB
        </div>
        
        <div className="hidden md:flex items-center space-x-10">
          {/* ĐÃ CẬP NHẬT: Điều hướng đến trang Shop */}
          <button 
            onClick={() => navigate('/shop')}
            className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors"
          >
            SẢN PHẨM
          </button>
          
          <button 
          onClick={() => navigate('/about')}
          className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors">
            VỀ CHÚNG TÔI
          </button>

          {/* ĐÃ CẬP NHẬT: Điều hướng đến trang Quiz */}
          <button 
            onClick={() => navigate('/quiz')}
            className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors uppercase"
          >
            Quiz Da Liễu
          </button>
          
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/skin-profile')}
              className="px-8 py-2.5 bg-[#1E293B] text-white rounded-full font-bold text-xs tracking-widest shadow-lg hover:bg-black transition-all"
            >
              MY PROFILE
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-2.5 bg-glow-gradient text-white rounded-full font-bold text-xs tracking-widest shadow-[0_4px_15px_rgba(134,194,161,0.4)] hover:scale-105 transition-all"
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-48 pb-20 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-3/5 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#86C2A1]/10 border border-[#86C2A1]/20 text-[#86C2A1] text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Skincare
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-[#1E293B] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Đánh thức <br />
            <span className="italic font-medium text-[#86C2A1]">Vẻ đẹp khoa học</span>
          </h1>
          
          <p className="text-lg text-[#64748B] max-w-xl leading-relaxed font-medium">
            Không còn phải đoán mò về làn da của bạn. GlowLab kết hợp trí tuệ nhân tạo và dược mỹ phẩm để tạo ra phác đồ chăm sóc cá nhân hóa tuyệt đối.
          </p>
          
          <div className="flex flex-wrap gap-5 pt-4">
            <button 
              onClick={() => navigate('/quiz')}
              className="group flex items-center gap-3 px-10 py-5 bg-[#1E293B] text-white rounded-2xl font-bold text-sm tracking-widest shadow-2xl hover:bg-black transition-all"
            >
              BẮT ĐẦU PHÂN TÍCH DA <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-8 pt-10 border-t border-gray-200/50">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold tracking-tighter uppercase">Dermatologist Tested</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-bold tracking-tighter uppercase">AI Precision</span>
            </div>
          </div>
        </motion.div>

        {/* Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:w-2/5 relative"
        >
          <div className="relative w-full aspect-[4/5] glass-effect rounded-[4rem] border-[12px] border-white/40 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#86C2A1]/20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-full border border-[#86C2A1] flex items-center justify-center mb-6">
                    <Heart className="text-[#86C2A1] w-8 h-8 fill-[#86C2A1]/20" />
                </div>
                <h3 className="text-[#1E293B] font-bold text-2xl mb-4 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Pure Glow</h3>
                <p className="text-gray-500 text-sm italic">"Làn da của bạn là một kiệt tác, hãy chăm sóc nó bằng khoa học."</p>
            </div>
          </div>
          
          {/* Floating Card UI */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 glass-effect p-6 shadow-2xl border-white/80"
          >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-glow-gradient rounded-full flex items-center justify-center text-white font-bold">98%</div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Độ tương thích</p>
                    <p className="text-sm font-bold text-[#1E293B]">Serum Vitamin C</p>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="px-8 py-20 bg-white/20 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
                { label: "Sản phẩm", value: "300+" },
                { label: "Người dùng", value: "10k+" },
                { label: "Độ chính xác AI", value: "99.2%" },
                { label: "Chuyên gia", value: "24/7" },
            ].map((stat, i) => (
                <div key={i}>
                    <p className="text-4xl font-bold text-[#1E293B] mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-[#86C2A1] tracking-widest uppercase">{stat.label}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;