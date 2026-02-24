import React, { useEffect, useState, useCallback } from 'react';
import { motion} from 'framer-motion';
import { Search, ShoppingCart, Star, ArrowUpDown, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { productService } from '../services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { message, Pagination, Empty, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import type { RootState } from '../store';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // FIX LỖI: Thêm dấu "?" (Optional Chaining) để tránh crash nếu state.cart chưa load
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [skinType, setSkinType] = useState('');
  const [sortBy, setSortBy] = useState('name,asc');
  const [page, setPage] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: page,
         size: 12,
         keyword: debouncedSearch.trim() !== '' ? debouncedSearch : undefined, // Sửa null thành undefined
         skinType: skinType !== '' ? skinType : undefined,                     // Sửa null thành undefined
        sort: sortBy
      };

      const res: any = await productService.getAllProducts(queryParams);
      if (res && res.content) {
        setProducts(res.content);
        setTotalElements(res.totalElements);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, skinType, sortBy, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="relative min-h-screen pt-32 px-8 pb-20 overflow-hidden isolate">
      
      {/* BACKGROUND DECOR - CỐ ĐỊNH NỀN XANH GLOWLAB */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8fffb] via-[#f3faf6] to-[#eef7f1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#86C2A1]/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#86C2A1]/15 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] bg-[#86C2A1]/10 blur-[100px] rounded-full" />
      </div>

      {/* FLOATING CART BUTTON (NÚT GIỎ HÀNG NỔI) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/cart')}
        className="fixed bottom-10 right-10 z-50 p-5 bg-[#1E293B] text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20"
      >
        <Badge count={cartItems.length} offset={[5, -5]} color="#86C2A1">
          <ShoppingBag className="w-6 h-6 text-white" />
        </Badge>
      </motion.button>

      <div className="max-w-7xl mx-auto space-y-10 relative">
        
        {/* TOP NAVIGATION & BRANDING */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1E293B] font-bold text-[10px] tracking-widest transition-all uppercase"
          >
            <ArrowLeft size={14} /> Quay về trang chủ
          </button>
          <div className="hidden md:flex items-center gap-2 text-[#86C2A1]">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Store</span>
          </div>
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-6xl font-black text-[#1E293B] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              GLOWLAB <span className="text-[#86C2A1]">STORE</span>
            </h2>
            <p className="text-[#86C2A1] font-bold text-[10px] tracking-[0.2em] uppercase">
              {totalElements} Sản phẩm tinh chọn dành riêng cho bạn
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#86C2A1] transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm focus:border-[#86C2A1] outline-none transition-all"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              />
            </div>

            <div className="relative group">
              <select
                className="appearance-none pl-8 pr-14 py-4 rounded-3xl bg-[#1E293B] text-white shadow-xl font-bold text-xs outline-none cursor-pointer hover:bg-black transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name,asc">Sắp xếp: A-Z</option>
                <option value="price,asc">Giá: Thấp - Cao</option>
                <option value="price,desc">Giá: Cao - Thấp</option>
              </select>
              <ArrowUpDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => { setSkinType(''); setPage(0); }}
            className={`px-10 py-3.5 rounded-full text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${
              skinType === ''
                ? 'bg-[#86C2A1] text-white border-[#86C2A1] shadow-lg shadow-[#86C2A1]/20'
                : 'bg-white/40 backdrop-blur-sm text-gray-400 border-white/80 hover:border-[#86C2A1]/40'
            }`}
          >
            TẤT CẢ
          </button>

          {['OILY', 'DRY', 'SENSITIVE', 'NORMAL', 'COMBINATION'].map((type) => (
            <button
              key={type}
              onClick={() => { setSkinType(type); setPage(0); }}
              className={`px-10 py-3.5 rounded-full text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${
                skinType === type
                  ? 'bg-[#86C2A1] text-white border-[#86C2A1] shadow-lg shadow-[#86C2A1]/20'
                  : 'bg-white/40 backdrop-blur-sm text-gray-400 border-white/80 hover:border-[#86C2A1]/40'
              }`}
            >
              DA {type}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[3rem] bg-white/30 animate-pulse border border-white/50" />
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} dispatch={dispatch} navigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-[3rem] border border-white/50">
                <Empty description="Không tìm thấy sản phẩm" />
                <button
                  onClick={() => { setSkinType(''); setSearchTerm(''); }}
                  className="mt-4 text-[#86C2A1] font-bold text-xs underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center pt-10">
          <Pagination
            current={page + 1}
            total={totalElements}
            pageSize={12}
            onChange={(p) => setPage(p - 1)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, dispatch, navigate }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -12 }}
    className="group"
  >
    <div 
      className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/80 shadow-sm border border-white/80 mb-6 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.imageUrl || 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&h=500&auto=format&fit=crop'}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart(product));
          message.success("Đã thêm vào giỏ");
        }}
        className="absolute bottom-8 right-8 p-5 bg-[#1E293B] text-white rounded-[1.5rem] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:bg-[#86C2A1]"
      >
        <ShoppingCart size={22} />
      </button>

      <div className="absolute top-8 left-8 px-4 py-1.5 bg-[#1E293B] rounded-full shadow-lg border border-white/10">
        <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">
          {product.brand}
        </span>
      </div>
    </div>

    <div className="text-center space-y-2 px-2">
      <h4 className="font-bold text-[#1E293B] line-clamp-1 text-base leading-tight group-hover:text-[#86C2A1] transition-colors">
        {product.name}
      </h4>

      <div className="flex items-center justify-center gap-1 text-yellow-400">
        <Star size={10} fill="currentColor" />
        <span className="text-[10px] font-bold text-gray-400">
          {product.ratingAvg || 5.0}
        </span>
      </div>

      <p className="text-xl font-black text-[#1E293B]">
        {new Intl.NumberFormat('vi-VN').format(product.price)} <span className="text-xs font-bold text-gray-400 uppercase">VND</span>
      </p>
    </div>
  </motion.div>
);

export default ShopPage;