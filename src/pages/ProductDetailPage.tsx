import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, Star, ShieldCheck, 
  Droplets, Sparkles, Plus, Minus, MessageSquare, 
  User, ChevronDown, ChevronUp, Leaf, AlertTriangle, AlertCircle, ShoppingBag
} from 'lucide-react';
import { productService } from '../services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { message, Skeleton, Badge } from 'antd';
import type { RootState } from '../store';

// Tránh lỗi re-render của Redux khi giỏ hàng trống
const EMPTY_ARRAY: any[] = [];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy số lượng giỏ hàng để hiển thị trên nút nổi
  const cartItems = useSelector((state: RootState) => state.cart?.items || EMPTY_ARRAY);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'reviews'>('ingredients');
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // ================= STATE CHO MODAL ĐÁNH GIÁ & DANH SÁCH REVIEW =================
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ratingStar, setRatingStar] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  
  // Chuyển reviews thành State để có thể cập nhật ngay lập tức khi người dùng thêm mới
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // UX: Tự động cuộn lên đầu trang khi vào chi tiết sản phẩm
    window.scrollTo(0, 0);
    
    if (id) {
      setLoading(true);
      productService.getProductById(id)
        .then((res: any) => {
          setProduct(res);
          // Set danh sách review mặc định hoặc từ API
          setReviews(res.reviews || [
            { id: 1, user: 'Minh Tú', rating: 5, date: '20/02/2026', content: 'Sản phẩm lành tính, texture thấm nhanh, không bết dính.' },
            { id: 2, user: 'Hoàng Oanh', rating: 4, date: '15/02/2026', content: 'Cấp ẩm tốt vào mùa đông. Giá hơi cao một chút nhưng đáng tiền.' }
          ]);
        })
        .catch(() => message.error("Không tìm thấy thông tin sản phẩm!"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for(let i = 0; i < quantity; i++) dispatch(addToCart(product));
      message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  // ================= HÀM XỬ LÝ GỬI ĐÁNH GIÁ (CẢI TIẾN) =================
  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      message.warning("Vui lòng nhập nội dung trải nghiệm của bạn!");
      return;
    }

    // Tạo một Đánh giá mới
    const newReview = {
      id: Date.now(), // Tạo ID ngẫu nhiên
      user: 'Bạn', // Tên người dùng hiện tại (có thể lấy từ Redux Auth)
      rating: ratingStar,
      date: new Date().toLocaleDateString('vi-VN'), // Lấy ngày hiện tại format VN
      content: reviewContent
    };

    // Chèn đánh giá mới lên đầu danh sách
    setReviews([newReview, ...reviews]);

    // TODO: Sau này gọi API POST /api/v1/reviews tại đây để lưu vào Database

    message.success("Cảm ơn bạn! Đánh giá đã được gửi thành công.");
    setIsReviewModalOpen(false); // Đóng modal
    setReviewContent('');        // Reset form
    setRatingStar(5);            // Reset sao
  };

  const getRiskStyle = (level: string) => {
    const l = level?.toUpperCase() || '';
    if (l === 'SAFE' || l === 'LOW') return 'bg-[#86C2A1]/10 text-[#86C2A1] border-[#86C2A1]/30';
    if (l === 'MODERATE' || l === 'MEDIUM') return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    if (l === 'HIGH') return 'bg-red-50 text-red-500 border-red-200';
    return 'bg-gray-50 text-gray-400 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-8 flex justify-center bg-[#FDFDFD]">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton.Image active className="!w-full !h-[600px] !rounded-[3rem]" />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Xử lý logic hiển thị thành phần
  const ingredientsList = product.ingredients || [];
  const visibleIngredients = showAllIngredients ? ingredientsList : ingredientsList.slice(0, 6);
  
  const safeCount = ingredientsList.filter((i: any) => ['SAFE', 'LOW'].includes(i.riskLevel?.toUpperCase())).length;
  const moderateCount = ingredientsList.filter((i: any) => ['MODERATE', 'MEDIUM'].includes(i.riskLevel?.toUpperCase())).length;
  const highCount = ingredientsList.filter((i: any) => i.riskLevel?.toUpperCase() === 'HIGH').length;

  return (
    <div className="relative min-h-screen pt-32 px-4 md:px-8 pb-20 overflow-hidden isolate bg-transparent">
      
      {/* BACKGROUND CỐ ĐỊNH CHUẨN GLOWLAB */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#FDFDFD]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#86C2A1]/10 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[-5%] w-[35%] h-[35%] bg-[#86C2A1]/5 blur-[80px] rounded-full" />
      </div>

      {/* GIỎ HÀNG NỔI (FLOATING CART) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/cart')}
        className="fixed bottom-10 right-10 z-50 p-5 bg-[#1E293B] text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 hover:bg-[#86C2A1] transition-colors"
      >
        <Badge count={cartItems.length} offset={[5, -5]} color="#86C2A1">
          <ShoppingBag className="w-6 h-6 text-white" />
        </Badge>
      </motion.button>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* NÚT QUAY VỀ */}
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1E293B] font-bold text-[10px] tracking-widest transition-all uppercase w-fit group"
        >
          <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} />
          </div>
          Trở về cửa hàng
        </button>

        {/* ================= SECTION 1: TỔNG QUAN SẢN PHẨM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/60 backdrop-blur-md shadow-xl border border-white p-4">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
              <img 
                src={product.imageUrl || 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800'} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">{product.brand || 'GLOWLAB'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} fill={i < Math.floor(product.ratingAvg || 5) ? "currentColor" : "none"} size={16} />)}
                </div>
                <span className="text-sm font-bold text-gray-400">{product.ratingAvg || 5.0} • {reviews.length} Đánh giá</span>
              </div>
            </div>

            <div className="text-4xl font-black text-[#1E293B]">
              {new Intl.NumberFormat('vi-VN').format(product.price)} <span className="text-lg font-bold text-gray-400 uppercase">VNĐ</span>
            </div>

            <p className="text-gray-500 leading-relaxed font-medium">
              {product.description || "Công thức độc quyền từ chuyên gia da liễu, mang lại hiệu quả rõ rệt mà vẫn đảm bảo sự dịu nhẹ tuyệt đối cho làn da."}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center bg-white/60 backdrop-blur-md border border-white rounded-full p-2 shadow-sm">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-white rounded-full transition-colors text-gray-500"><Minus size={16}/></motion.button>
                <span className="w-12 text-center font-black text-lg text-[#1E293B]">{quantity}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-white rounded-full transition-colors text-gray-500"><Plus size={16}/></motion.button>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-6 bg-[#1E293B] text-white rounded-full font-bold text-xs tracking-widest shadow-xl hover:bg-[#86C2A1] transition-all"
              >
                <ShoppingCart size={18} /> THÊM VÀO GIỎ HÀNG
              </motion.button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200/50">
              <div className="flex items-center gap-3 text-sm font-bold text-[#1E293B]">
                <div className="p-2 bg-[#86C2A1]/10 rounded-full"><ShieldCheck className="text-[#86C2A1]" size={20} /></div> An toàn y khoa
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-[#1E293B]">
                <div className="p-2 bg-[#86C2A1]/10 rounded-full"><Droplets className="text-[#86C2A1]" size={20} /></div> Cấp ẩm chuyên sâu
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= SECTION 2: TABS ================= */}
        <div className="pt-10">
          <div className="flex items-center justify-center gap-8 border-b border-gray-200/50 mb-10">
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 text-xs font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === 'ingredients' ? 'text-[#1E293B]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="flex items-center gap-2"><Sparkles size={16}/> Thành phần</span>
              {activeTab === 'ingredients' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#86C2A1] rounded-t-full" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === 'reviews' ? 'text-[#1E293B]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="flex items-center gap-2"><MessageSquare size={16}/> Đánh giá ({reviews.length})</span>
              {activeTab === 'reviews' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#86C2A1] rounded-t-full" />}
            </button>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* TAB THÀNH PHẦN */}
              {activeTab === 'ingredients' && (
                <motion.div key="ingredients" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-8 md:p-12 shadow-sm">
                    
                    {ingredientsList.length > 0 ? (
                      <>
                        <div className="flex flex-wrap items-center gap-6 mb-10 p-6 bg-white/50 rounded-3xl border border-gray-100 shadow-sm">
                           <div className="text-sm font-bold text-[#1E293B] mr-4">Tổng quan:</div>
                           <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-xs font-bold border border-green-100 shadow-sm">
                              <Leaf size={14} /> An toàn ({safeCount})
                           </div>
                           {moderateCount > 0 && (
                             <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full text-xs font-bold border border-yellow-100 shadow-sm">
                                <AlertCircle size={14} /> Cần lưu ý ({moderateCount})
                             </div>
                           )}
                           {highCount > 0 && (
                             <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full text-xs font-bold border border-red-100 shadow-sm">
                                <AlertTriangle size={14} /> Cảnh báo ({highCount})
                             </div>
                           )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <AnimatePresence>
                            {visibleIngredients.map((ing: any, idx: number) => (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={idx} 
                                className="bg-white p-6 rounded-3xl border border-white shadow-sm hover:shadow-md hover:border-[#86C2A1]/30 transition-all group"
                              >
                                <h4 className="font-bold text-[#1E293B] uppercase text-sm mb-2 group-hover:text-[#86C2A1] transition-colors line-clamp-1" title={ing.name}>{ing.name}</h4>
                                <p className="text-xs text-gray-400 mb-6 font-medium line-clamp-1">{ing.functionTag !== 'Unknown' ? ing.functionTag : 'Chất bổ trợ công thức'}</p>
                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${getRiskStyle(ing.riskLevel)}`}>
                                  MỨC ĐỘ: {ing.riskLevel || 'SAFE'}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {ingredientsList.length > 6 && (
                          <div className="flex justify-center mt-10">
                            <button 
                              onClick={() => setShowAllIngredients(!showAllIngredients)}
                              className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-500 hover:text-[#1E293B] hover:border-[#1E293B] transition-all shadow-sm"
                            >
                              {showAllIngredients ? (
                                <>Thu gọn <ChevronUp size={16}/></>
                              ) : (
                                <>Xem tất cả {ingredientsList.length} thành phần <ChevronDown size={16}/></>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-400">Đang cập nhật danh sách thành phần chi tiết.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB ĐÁNH GIÁ CẢI TIẾN THEO DESIGN */}
              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-8 md:p-12 shadow-sm">
                    <div className="flex justify-between items-center mb-10 pb-8 border-b border-gray-100">
                      <div>
                        <h3 className="text-3xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>Trải nghiệm thực tế</h3>
                        <p className="text-sm text-gray-500 mt-2">Đánh giá từ những người đã sử dụng sản phẩm</p>
                      </div>
                      {/* Nút Viết Đánh Giá được style lại giống ảnh image_45e271.png */}
                      <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="hidden md:block px-8 py-4 bg-[#86C2A1]/90 text-white font-bold rounded-[2rem] text-xs uppercase tracking-widest shadow-sm hover:bg-[#86C2A1] transition-colors"
                      >
                        Viết đánh giá
                      </button>
                    </div>

                    <div className="space-y-6">
                      <AnimatePresence>
                        {reviews.map((rev: any) => (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={rev.id} 
                            className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                          >
                            <div className="w-14 h-14 bg-[#1E293B] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                              <User className="text-white w-6 h-6" />
                            </div>
                            <div className="space-y-3 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-[#1E293B] text-sm uppercase tracking-wider">{rev.user}</h5>
                                  <div className="flex items-center gap-1 text-yellow-400 mt-1.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill={i < rev.rating ? "currentColor" : "none"} size={14} className={i < rev.rating ? "text-yellow-400" : "text-gray-200"} />)}
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{rev.date}</span>
                              </div>
                              <p className="text-gray-500 leading-relaxed text-sm font-medium">{rev.content}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ================= MODAL VIẾT ĐÁNH GIÁ CHUẨN DESIGN ================= */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsReviewModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="bg-white rounded-[2.5rem] p-10 relative z-10 w-full max-w-md shadow-2xl border border-white"
            >
              <h3 className="text-3xl font-black text-[#1E293B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Chia sẻ trải nghiệm</h3>
              <p className="text-sm text-gray-500 mb-8 font-medium">Đánh giá của bạn giúp GLOWLAB hoàn thiện hơn mỗi ngày.</p>

              <div className="flex items-center gap-3 mb-8 justify-center bg-gray-50/80 py-6 rounded-3xl border border-gray-100">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={36} 
                    className={`cursor-pointer transition-all hover:scale-110 ${star <= ratingStar ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                    onClick={() => setRatingStar(star)}
                  />
                ))}
              </div>

              <textarea 
                rows={4}
                placeholder="Sản phẩm này có phù hợp với làn da của bạn không?"
                className="w-full px-6 py-5 rounded-3xl bg-gray-50/80 border border-gray-100 focus:border-[#86C2A1] focus:bg-white outline-none transition-all resize-none font-medium text-[#1E293B] mb-8"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-4 text-gray-500 font-bold text-sm rounded-[2rem] hover:bg-gray-50 transition-colors"
                >
                  HỦY
                </button>
                <button 
                  onClick={handleSubmitReview}
                  className="flex-[2] py-4 bg-[#1E293B] text-white rounded-[2rem] font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-[#2e3e55] transition-all"
                >
                  GỬI ĐÁNH GIÁ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;