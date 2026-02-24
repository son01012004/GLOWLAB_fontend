import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../store/cartSlice';
import type { RootState } from '../store';

const EMPTY_ARRAY: any[] = [];

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state: RootState) => state.cart?.items || EMPTY_ARRAY);
  const totalAmount = useSelector((state: RootState) => state.cart?.totalAmount || 0);

  const FREE_SHIP_THRESHOLD = 1000000;
  const shippingFee = totalAmount >= FREE_SHIP_THRESHOLD || totalAmount === 0 ? 0 : 35000;
  const finalTotal = totalAmount + shippingFee;
  const neededForFreeShip = FREE_SHIP_THRESHOLD - totalAmount;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

  return (
    <div className="relative min-h-screen pt-32 px-4 md:px-8 pb-20 overflow-hidden isolate bg-[#fcfcfc]">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8fffb] via-[#fcfcfc] to-[#eef7f1]">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/20 blur-[150px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#86C2A1]/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        
        {/* TOP NAVIGATION */}
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#86C2A1] font-bold text-[10px] tracking-widest transition-all uppercase group"
        >
          <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} />
          </div>
          Tiếp tục mua sắm
        </button>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-4 border-b border-gray-100/50">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-[#1E293B] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Giỏ Hàng <span className="text-[#86C2A1] italic font-medium">Của Bạn</span>
            </h1>
            <p className="text-[#86C2A1] font-bold text-xs tracking-[0.2em] uppercase mt-4 flex items-center gap-2">
              <Sparkles size={14}/> Đã chọn {cartItems.length} sản phẩm tinh hoa
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[3rem] shadow-sm relative overflow-hidden"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-32 h-32 bg-gradient-to-tr from-white to-gray-50 rounded-full flex items-center justify-center mb-8 shadow-[0_10px_30px_-10px_rgba(134,194,161,0.4)] border border-white">
              <ShoppingBag className="w-12 h-12 text-[#86C2A1]" />
            </motion.div>
            <h2 className="text-3xl font-black text-[#1E293B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Chưa có gì ở đây cả!</h2>
            <p className="text-gray-400 mb-10 font-medium">Làn da của bạn đang chờ đợi điều kỳ diệu từ GlowLab.</p>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 30px -10px rgba(134,194,161,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="px-12 py-5 bg-[#1E293B] text-white rounded-full font-bold text-xs tracking-widest shadow-xl transition-all"
            >
              KHÁM PHÁ NGAY
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* CỘT TRÁI: DANH SÁCH */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode='popLayout'>
                {cartItems.map((item: any) => (
                  <motion.div 
                    layout
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    whileHover={{ y: -5, borderColor: 'rgba(134,194,161,0.4)', boxShadow: "0 15px 30px -10px rgba(0,0,0,0.05)" }}
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white/70 backdrop-blur-md border border-white p-5 rounded-[2rem] shadow-sm relative group transition-all"
                  >
                    {/* FIX ẢNH BỊ LỖI CHỮ: Thêm ảnh fallback mặc định */}
                    <div className="w-full sm:w-28 h-28 shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-white shadow-inner relative flex items-center justify-center">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&h=500&auto=format&fit=crop'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    <div className="flex-1 w-full space-y-1 text-center sm:text-left">
                      <p className="text-[9px] font-black text-[#86C2A1]/80 uppercase tracking-[0.2em]">{item.brand}</p>
                      <h3 className="text-base font-bold text-[#1E293B] leading-snug line-clamp-2">{item.name}</h3>
                      <p className="text-lg font-black text-[#1E293B] pt-1">
                        {formatPrice(item.price)} <span className="text-[9px] font-bold text-gray-400 uppercase">VNĐ</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 relative">
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2.5 bg-gray-100 text-gray-400 rounded-full sm:absolute sm:top-0 sm:right-0 sm:opacity-0 sm:-translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={16} />
                      </motion.button>

                      <div className="flex items-center bg-[#f8fafc] rounded-full border border-gray-100 p-1 shadow-inner mt-auto">
                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => dispatch(decreaseQuantity(item.id))} className="p-2.5 bg-white hover:bg-gray-50 rounded-full transition-colors text-gray-500 shadow-sm border border-gray-100">
                          <Minus size={12} />
                        </motion.button>
                        
                        <AnimatePresence mode='wait'>
                          <motion.span 
                            key={item.quantity}
                            initial={{ y: -10, opacity: 0, color: '#86C2A1' }}
                            animate={{ y: 0, opacity: 1, color: '#1E293B' }}
                            exit={{ y: 10, opacity: 0 }}
                            className="w-8 text-center font-black text-sm"
                          >
                            {item.quantity}
                          </motion.span>
                        </AnimatePresence>

                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => dispatch(addToCart(item))} className="p-2.5 bg-white hover:bg-gray-50 rounded-full transition-colors text-gray-500 shadow-sm border border-gray-100">
                          <Plus size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CỘT PHẢI: BILL THANH TOÁN */}
            <div className="lg:col-span-4 relative">
              <div className="bg-[#1E293B] text-white rounded-[2.5rem] p-8 sticky top-32 shadow-2xl relative overflow-hidden ring-4 ring-[#1E293B]/5">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-30%] right-[-30%] w-[80%] h-[80%] bg-gradient-to-br from-[#86C2A1]/20 to-transparent blur-[60px] rounded-full pointer-events-none" />

                <h3 className="text-2xl font-bold mb-8 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>Tóm Tắt Đơn Hàng</h3>
                
                <div className="space-y-4 text-sm font-medium mb-8 relative z-10">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Tạm tính</span>
                    <span className="text-white font-bold">{formatPrice(totalAmount)} đ</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Vận chuyển</span>
                    <span className="text-[#86C2A1] font-bold">{shippingFee === 0 ? 'Miễn phí' : `${formatPrice(shippingFee)} đ`}</span>
                  </div>

                  {shippingFee > 0 && (
                    <div className="bg-white/10 p-3 rounded-xl mt-2">
                      <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
                        <Gift size={12} className="text-[#86C2A1]" />
                        Mua thêm <span className="text-[#86C2A1] font-bold">{formatPrice(neededForFreeShip)}đ</span> để được Freeship
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(totalAmount / FREE_SHIP_THRESHOLD) * 100}%` }}
                          className="h-full bg-gradient-to-r from-[#86C2A1] to-[#6ba384] rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 mb-8 relative z-10">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Tổng thanh toán</span>
                    <div className="text-right">
                      <motion.span key={finalTotal} initial={{ scale: 1.1, color: '#fff' }} animate={{ scale: 1, color: '#86C2A1' }} className="text-3xl font-black block">
                        {formatPrice(finalTotal)} đ
                      </motion.span>
                      <span className="text-[9px] text-gray-500 tracking-widest uppercase mt-1 block">Đã bao gồm thuế VAT</span>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ boxShadow: ["0px 0px 0px rgba(134,194,161,0)", "0px 10px 25px -5px rgba(134,194,161,0.5)", "0px 0px 0px rgba(134,194,161,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#86C2A1] text-white rounded-full font-black text-xs tracking-widest shadow-xl relative z-10 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">XÁC NHẬN THANH TOÁN <ArrowRight size={16} /></span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest relative z-10">
                  <ShieldCheck size={12} className="text-[#86C2A1]" /> Bảo mật SSL 256-bit
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;