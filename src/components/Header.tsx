import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/authSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Không hiển thị Header trên các trang admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-effect !rounded-none border-none px-8 py-5 flex justify-between items-center bg-white/40 backdrop-blur-xl shadow-sm">
      <div 
        className="text-3xl font-bold text-[#1E293B] tracking-[0.2em] cursor-pointer" 
        style={{ fontFamily: "'Playfair Display', serif" }}
        onClick={() => navigate('/')}
      >
        GLOWLAB
      </div>
      
      <div className="hidden md:flex items-center space-x-10">
        <button 
          onClick={() => navigate('/shop')}
          className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors"
        >
          SẢN PHẨM
        </button>
        
        <button 
          onClick={() => navigate('/about')}
          className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors"
        >
          VỀ CHÚNG TÔI
        </button>

        <button 
          onClick={() => navigate('/quiz')}
          className="text-[#64748B] hover:text-[#86C2A1] font-semibold text-sm tracking-widest transition-colors uppercase"
        >
          Quiz Da Liễu
        </button>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/skin-profile')}
              className="px-8 py-2.5 bg-[#1E293B] text-white rounded-full font-bold text-xs tracking-widest shadow-lg hover:bg-black transition-all"
            >
              MY PROFILE
            </button>
            <button 
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-full font-bold text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              LOGOUT
            </button>
          </div>
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
  );
};

export default Header;
