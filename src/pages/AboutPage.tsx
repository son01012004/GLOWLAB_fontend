import React, { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Cpu, Leaf, Heart, ArrowRight, Activity, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="relative min-h-screen pt-40 px-4 md:px-8 pb-32 overflow-hidden isolate bg-[#fcfcfc]">
      
      {/* ================= NỀN GRADIENT CHUYỂN ĐỘNG (WOW FACTOR) ================= */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Đốm màu chính - Di chuyển chậm */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1] 
          }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-[#86C2A1]/20 blur-[150px] rounded-full" 
        />
        
        {/* Đốm màu phụ - Tone màu ấm hơn để cân bằng */}
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            scale: [1, 1.3, 1] 
          }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/15 blur-[120px] rounded-full" 
        />

        {/* Lớp hạt nhiễu nhẹ (Grainy Texture) tạo cảm giác như giấy mỹ thuật cao cấp */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto space-y-40 relative z-10"
      >
        
        {/* ================= HERO SECTION (TỐI ƯU TYPOGRAPHY) ================= */}
        <div className="text-center max-w-5xl mx-auto space-y-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white shadow-[0_8px_32px_0_rgba(134,194,161,0.1)] text-[#86C2A1] font-black text-[10px] tracking-[0.4em] uppercase">
            <Sparkles size={14} className="animate-pulse" />
            <span>Khai phóng vẻ đẹp khoa học</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black text-[#1E293B] leading-[0.95] tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tái Định Nghĩa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86C2A1] via-[#6ba384] to-[#86C2A1] italic font-medium py-2">
              Vẻ Đẹp Độc Bản
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto">
            Tại <span className="text-[#1E293B] font-bold">GLOWLAB</span>, chúng tôi không bán mỹ phẩm. Chúng tôi cung cấp giải pháp <span className="text-[#86C2A1] italic">cá nhân hóa</span> dựa trên mã gen làn da của riêng bạn.
          </motion.p>
        </div>

        {/* ================= THÔNG ĐIỆP CHÍNH (LAYOUT BẤT ĐỐI XỨNG) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#86C2A1]/20 to-transparent blur-2xl rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop" 
                alt="Lab Research" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/40 to-transparent"></div>
              
              {/* Floating Tech Card */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -right-10 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl border border-white"
              >
                <div className="p-4 bg-[#86C2A1] text-white rounded-2xl shadow-lg shadow-[#86C2A1]/30">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#86C2A1] uppercase tracking-widest">Hiệu quả</p>
                  <p className="text-lg font-bold text-[#1E293B]">Vượt trội 98%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-[#1E293B] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sự Kết Hợp Hoàn Hảo Giữa <br/>
                <span className="italic text-[#86C2A1]">AI & Y Khoa</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                Chúng tôi tiên phong ứng dụng trí tuệ nhân tạo để bóc tách từng phân tử trong bảng thành phần. Tại GLOWLAB, mọi sản phẩm đều phải vượt qua bài kiểm tra tương thích sinh học khắt khe nhất trước khi đến tay bạn.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white hover:border-[#86C2A1]/30 transition-all">
                <Leaf className="text-[#86C2A1] mb-4" size={32} />
                <h4 className="font-bold text-[#1E293B] mb-2 text-lg">Thuần Khiết</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">Chiết xuất hữu cơ được chứng nhận quốc tế, bảo vệ làn da nhạy cảm nhất.</p>
              </div>
              <div className="p-8 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white hover:border-[#86C2A1]/30 transition-all">
                <Cpu className="text-[#86C2A1] mb-4" size={32} />
                <h4 className="font-bold text-[#1E293B] mb-2 text-lg">Đột Phá</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">Hệ thống phân tích tự động đề xuất liệu trình chăm sóc da 24/7.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================= GIÁ TRỊ CỐT LÕI (HOVER INTERACTIVE) ================= */}
        <div className="space-y-20">
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-5xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>Giá Trị Của Sự Minh Bạch</h2>
            <div className="w-24 h-1.5 bg-[#86C2A1] mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck />, title: 'Bảo Chứng Y Khoa', desc: 'Sản phẩm được khuyên dùng bởi các chuyên gia da liễu hàng đầu khu vực.' },
              { icon: <Activity />, title: 'Theo Dõi Thời Gian Thực', desc: 'Ứng dụng GlowLab giúp bạn theo dõi sự cải thiện của làn da qua từng ngày.' },
              { icon: <Heart />, title: 'Tận Tâm Phục Vụ', desc: 'Đội ngũ chuyên viên tư vấn cá nhân luôn sẵn sàng lắng nghe câu chuyện của bạn.' }
            ].map((item, idx) => (
              <motion.div 
                variants={itemVariants}
                key={idx} 
                className="relative p-12 bg-white/40 backdrop-blur-xl border border-white rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group overflow-hidden"
              >
                {/* FIX LỖI TypeScript Ở ĐÂY */}
                <div className="absolute top-0 right-0 p-8 text-[#86C2A1]/5 group-hover:text-[#86C2A1]/10 transition-colors">
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 120 })}
                </div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-[#86C2A1] mb-8 shadow-sm group-hover:bg-[#86C2A1] group-hover:text-white transition-all duration-500">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 40 })}
                  </div>
                  <h3 className="text-2xl font-black text-[#1E293B] mb-4">{item.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= FOOTER CTA (NEON GLOW) ================= */}
        <motion.div 
          variants={itemVariants} 
          className="relative rounded-[4rem] bg-[#1E293B] p-16 md:p-24 text-center overflow-hidden shadow-[0_40px_100px_-20px_rgba(30,41,59,0.4)]"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-1/2 -left-1/4 w-[100%] h-[200%] bg-gradient-to-br from-[#86C2A1]/20 to-transparent blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hãy để làn da bạn <br/> <span className="text-[#86C2A1]">lên tiếng</span>
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto">
              Bạn chỉ cách làn da mơ ước một bài phân tích. Hãy bắt đầu hành trình Glow Up cùng chúng tôi ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(134,194,161,0.4)" }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="px-12 py-6 bg-[#86C2A1] text-[#1E293B] rounded-full font-black text-xs tracking-widest uppercase transition-all"
              >
                Phân tích da miễn phí
              </motion.button>
              <motion.button 
                whileHover={{ x: 10, color: "#86C2A1" }}
                onClick={() => navigate('/shop')}
                className="px-8 py-6 text-white font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all"
              >
                Vào cửa hàng <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AboutPage;