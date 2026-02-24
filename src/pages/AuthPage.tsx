import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd'; // Thư viện thông báo chuẩn Production
import { fadeUpVariant, slideXVariant } from '../animations/variants';
import { authService } from '../services/auth.service';
import { loginSuccess } from '../store/authSlice';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // State lưu dữ liệu form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const useDispatchAction = useDispatch();
  const direction = isLogin ? -1 : 1;

  // Xử lý khi bấm nút Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      message.warning('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // GỌI API ĐĂNG NHẬP
        const res: any = await authService.login({ email, password });

        localStorage.setItem('token', res.token);
        useDispatchAction(loginSuccess(res.token));

        const userRole = res.role || (res.user && res.user.role);

        if (userRole === 'ROLE_ADMIN') { // Thay vì check 'ADMIN', hãy check 'ROLE_ADMIN'
        message.success('Chào mừng Quản trị viên!');
        navigate('/admin'); 
        } else {
        message.success('Đăng nhập thành công!');
        navigate('/'); 
        }
        
      } else {
        // GỌI API ĐĂNG KÝ
        await authService.register({ email, password });
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); // Trượt về form đăng nhập
        setPassword(''); // Xóa trắng pass
      }
    } catch (error: any) {
      // In toàn bộ error ra console để xem Backend đang phàn nàn gì
      console.log("Chi tiết lỗi Backend:", error); 
      
      // Hiển thị thông báo cụ thể
      if (error.response && error.response.data) {
          message.error(JSON.stringify(error.response.data)); 
      } else {
          message.error(error.message || 'Lỗi kết nối server!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div 
        variants={fadeUpVariant} initial="hidden" animate="visible"
        className="glass-effect w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E293B] mb-2 tracking-[0.15em]" style={{ fontFamily: "'Playfair Display', serif" }}>GLOWLAB</h1>
          <p className="text-[#64748B] text-sm font-medium tracking-wide">Your Personal Skincare Expert</p>
        </div>

        <div className="relative flex bg-white/30 backdrop-blur-md rounded-xl p-1 mb-8 border border-white/40">
          <button onClick={() => setIsLogin(true)} className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${isLogin ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>Đăng nhập</button>
          <button onClick={() => setIsLogin(false)} className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${!isLogin ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>Đăng ký</button>
          <motion.div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm z-0" animate={{ left: isLogin ? '4px' : 'calc(50% + 0px)' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
        </div>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.form key={isLogin ? 'login' : 'register'} custom={direction} variants={slideXVariant} initial="hidden" animate="visible" exit="exit" className="absolute w-full top-0 left-0 space-y-5" onSubmit={handleSubmit}>
              
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#86C2A1]" />
                <input 
                  type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/40 border border-white/50 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#86C2A1]/50 text-[#1E293B] font-medium" 
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#86C2A1]" />
                <input 
                  type="password" 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Mật khẩu" : "Tạo mật khẩu (>6 ký tự)"} 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/40 border border-white/50 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#86C2A1]/50 text-[#1E293B] font-medium" 
                />
              </div>

              <button disabled={loading} type="submit" className={`group w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-bold text-white transition-all duration-300 ${isLogin ? 'bg-glow-gradient shadow-[0_8px_20px_rgba(134,194,161,0.4)]' : 'bg-[#1E293B] shadow-[0_8px_20px_rgba(30,41,59,0.3)]'} ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{isLogin ? 'TRẢI NGHIỆM NGAY' : 'TẠO TÀI KHOẢN'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;