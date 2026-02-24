import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, CreditCard, Wallet, 
  ShieldCheck, CheckCircle2, Truck, Lock, Loader2 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { message } from 'antd';
import type { RootState } from '../store';
import api from '../utils/axios';

const EMPTY_ARRAY: any[] = [];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state: RootState) => state.cart?.items || EMPTY_ARRAY);
  const totalAmount = useSelector((state: RootState) => state.cart?.totalAmount || 0);

  const FREE_SHIP_THRESHOLD = 1000000;
  const shippingFee = totalAmount >= FREE_SHIP_THRESHOLD || totalAmount === 0 ? 0 : 35000;
  const finalTotal = totalAmount + shippingFee;
  
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('VNPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });

  // ================= LOGIC GỌI API BACKEND =================
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      message.error("Giỏ hàng đang trống!"); return;
    }
    if (!formData.fullName || !formData.phone || !formData.address) {
      message.warning("Vui lòng điền đầy đủ thông tin giao hàng!"); return;
    }

    setIsProcessing(true);
    const fullShippingAddress = `${formData.address}, ${formData.city}`;

    try {
      // 1. Gọi API Checkout
      const checkoutPayload = {
        shippingAddress: fullShippingAddress,
        paymentMethod: paymentMethod
      };
      
      const checkoutRes: any = await api.post('/cart/checkout', checkoutPayload);
      console.log("📦 DỮ LIỆU CHECKOUT:", checkoutRes); 
      
      const responseData = checkoutRes.data || checkoutRes;

      // 2. TRÍCH XUẤT ORDER ID TỪ CÂU THÔNG BÁO CỦA BACKEND
      let orderId = null;
      if (responseData.message && responseData.message.includes('Order ID: ')) {
        orderId = responseData.message.split('Order ID: ')[1].trim();
      } else {
        orderId = responseData.id || responseData.orderId; 
      }

      console.log("🔑 ORDER ID TÌM THẤY:", orderId);

      if (!orderId) {
         message.error("Không trích xuất được mã đơn hàng!");
         setIsProcessing(false);
         return;
      }

      // 3. Xử lý thanh toán VNPay
      if (paymentMethod === 'VNPAY') {
        message.loading({ content: 'Đang tạo cổng thanh toán...', key: 'payment' });
        
        const paymentRes: any = await api.get(`/payment/create_payment/${orderId}`);
        console.log("💳 DỮ LIỆU VNPAY:", paymentRes);

        const paymentData = paymentRes.data || paymentRes;
        
        let vnpayUrl = paymentData.url || paymentData.paymentUrl;
        
        if (!vnpayUrl && typeof paymentData === 'string' && paymentData.startsWith('http')) {
            vnpayUrl = paymentData;
        } else if (!vnpayUrl && paymentData.message && paymentData.message.startsWith('http')) {
            vnpayUrl = paymentData.message;
        }
        
        if (vnpayUrl && typeof vnpayUrl === 'string' && vnpayUrl.startsWith('http')) {
          dispatch(clearCart());
          window.location.href = vnpayUrl; 
        } else {
          message.error("Không tìm thấy Link VNPay từ Backend!");
          setIsProcessing(false);
        }
      } else {
        // Đặt hàng COD
        dispatch(clearCart());
        navigate('/order-success');
      }

    } catch (error: any) {
      console.error("❌ Lỗi đặt hàng:", error.response || error);
      message.error(error.response?.data?.message || "Có lỗi từ server. Vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 px-4 md:px-8 pb-20 overflow-hidden isolate bg-[#fcfcfc]">
      
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8fffb] via-[#fcfcfc] to-[#eef7f1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#86C2A1]/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-400 hover:text-[#1E293B] font-bold text-[10px] tracking-widest transition-all uppercase group w-fit">
          <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm group-hover:-translate-x-1 transition-transform"><ArrowLeft size={14} /></div>
          Quay lại Giỏ hàng
        </button>

        <div className="pb-4 border-b border-gray-100/50">
          <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Thanh Toán <span className="text-[#86C2A1] italic font-medium">Đơn Hàng</span>
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-full text-[#1E293B]"><MapPin size={20} /></div>
                <h2 className="text-xl font-bold text-[#1E293B]">Thông tin giao hàng</h2>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Họ và Tên *</label>
                    <input type="text" required placeholder="VD: Nguyễn Văn A" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#86C2A1] focus:bg-white outline-none transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Số điện thoại *</label>
                    <input type="tel" required placeholder="VD: 0912 345 678" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#86C2A1] focus:bg-white outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Địa chỉ chi tiết *</label>
                  <input type="text" required placeholder="Số nhà, Tên đường, Phường/Xã..." className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#86C2A1] focus:bg-white outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Tỉnh / Thành phố *</label>
                  <input type="text" required placeholder="VD: TP. Hồ Chí Minh" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#86C2A1] focus:bg-white outline-none transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-full text-[#1E293B]"><Wallet size={20} /></div>
                <h2 className="text-xl font-bold text-[#1E293B]">Phương thức thanh toán</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setPaymentMethod('COD')} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#86C2A1] bg-[#86C2A1]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${paymentMethod === 'COD' ? 'bg-[#86C2A1] text-white' : 'bg-gray-100 text-gray-400'}`}><Truck size={20} /></div>
                    <div><h4 className="font-bold text-[#1E293B]">Thanh toán khi nhận hàng</h4><p className="text-xs text-gray-500 mt-1">Giao hàng tận nơi (COD)</p></div>
                  </div>
                  {paymentMethod === 'COD' && <CheckCircle2 className="absolute top-5 right-5 text-[#86C2A1]" size={20} />}
                </div>

                <div onClick={() => setPaymentMethod('VNPAY')} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-[#86C2A1] bg-[#86C2A1]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${paymentMethod === 'VNPAY' ? 'bg-[#86C2A1] text-white' : 'bg-gray-100 text-gray-400'}`}><CreditCard size={20} /></div>
                    <div><h4 className="font-bold text-[#1E293B]">Thanh toán VNPay</h4><p className="text-xs text-gray-500 mt-1">Thẻ ATM / Visa / Momo</p></div>
                  </div>
                  {paymentMethod === 'VNPAY' && <CheckCircle2 className="absolute top-5 right-5 text-[#86C2A1]" size={20} />}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CỘT PHẢI: BILL SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-[#1E293B] text-white rounded-[2.5rem] p-8 md:p-10 sticky top-32 shadow-2xl overflow-hidden ring-4 ring-[#1E293B]/5">
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-gradient-to-br from-[#86C2A1]/20 to-transparent blur-[60px] rounded-full pointer-events-none" />

              <h3 className="text-2xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>Đơn Hàng ({cartItems.length})</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=200&h=200&auto=format&fit=crop'} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1 text-white">{item.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#86C2A1] text-sm">{formatPrice(item.price * item.quantity)} đ</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm font-medium mb-8 relative z-10 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-gray-400"><span>Tạm tính</span><span className="text-white font-bold">{formatPrice(totalAmount)} đ</span></div>
                <div className="flex justify-between items-center text-gray-400"><span>Phí vận chuyển</span><span className="text-[#86C2A1] font-bold">{shippingFee === 0 ? 'Miễn phí' : `${formatPrice(shippingFee)} đ`}</span></div>
              </div>

              <div className="pt-6 border-t border-white/10 mb-10 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Tổng thanh toán</span>
                  <div className="text-right"><span className="text-4xl font-black text-[#86C2A1] block">{formatPrice(finalTotal)} đ</span></div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: (isProcessing || cartItems.length === 0) ? 1 : 1.02 }}
                whileTap={{ scale: (isProcessing || cartItems.length === 0) ? 1 : 0.98 }}
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full flex items-center justify-center gap-3 py-6 rounded-full font-black text-xs tracking-widest transition-all relative z-10 ${
                  cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isProcessing 
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                      : 'bg-[#86C2A1] text-white shadow-[0_10px_30px_-10px_rgba(134,194,161,0.6)] hover:bg-white hover:text-[#1E293B]'
                }`}
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />} 
                {cartItems.length === 0 ? 'GIỎ HÀNG TRỐNG' : isProcessing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
              </motion.button>

              <div className="mt-6 flex justify-center gap-4 text-gray-400 relative z-10">
                <ShieldCheck size={20} /><CreditCard size={20} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;