import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading');

  useEffect(() => {
    // Đọc mã phản hồi từ VNPay trên thanh URL
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

    if (vnp_ResponseCode) {
      // 00 là mã thành công của VNPay
      if (vnp_ResponseCode === '00') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } else {
      // Trường hợp đặt hàng COD (Không có params VNPay)
      setStatus('success');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#fcfcfc] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white p-10 rounded-[3rem] shadow-xl text-center max-w-lg w-full border border-gray-100"
      >
        {status === 'success' ? (
          <>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h1 className="text-3xl font-black text-[#1E293B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đặt Hàng Thành Công!
            </h1>
            <p className="text-gray-500 font-medium mb-8">
              Cảm ơn bạn đã tin tưởng GLOWLAB. Đơn hàng của bạn đang được hệ thống xử lý và sẽ sớm giao đến bạn.
            </p>
          </>
        ) : (
          <>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
            >
              <XCircle size={48} />
            </motion.div>
            <h1 className="text-3xl font-black text-[#1E293B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Thanh Toán Thất Bại
            </h1>
            <p className="text-gray-500 font-medium mb-8">
              Giao dịch của bạn đã bị hủy hoặc có lỗi xảy ra từ ngân hàng. Vui lòng thử lại.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/my-account')}
            className="w-full py-4 bg-[#1E293B] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#86C2A1] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Xem Đơn Hàng Của Tôi
          </button>
          <button 
            onClick={() => navigate('/shop')}
            className="w-full py-4 bg-white text-[#1E293B] border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            Tiếp Tục Mua Sắm <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;