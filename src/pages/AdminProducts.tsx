import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit, Trash2, 
  Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, X, Package
} from 'lucide-react';
import { message, Popconfirm } from 'antd';
import { productService } from '../services/product.service';
import { adminService } from '../services/admin.service';

interface ProductRequest {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  status?: string;
}

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<ProductRequest>({
    name: '', category: 'Serum', price: 0, stockQuantity: 0, imageUrl: '', description: '', status: 'ACTIVE'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data: any = await productService.getAllProducts(); 
      // Bổ sung array rỗng để tránh lỗi map
      setProducts(data?.content || data || []); 
    } catch (error) {
      console.error(error);
      message.error("Không thể tải dữ liệu từ Server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.deleteProduct(id);
      message.success(`Đã xóa sản phẩm thành công!`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      message.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: '', category: 'Serum', price: 0, stockQuantity: 0, imageUrl: '', description: '', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setIsEditMode(true);
    setEditingId(product.id);
    setFormData({
      name: product.name || product.productName || '', // Đề phòng Backend dùng productName
      category: product.category || 'Serum',
      price: product.price || 0,
      stockQuantity: product.stockQuantity || product.stock || 0,
      imageUrl: product.imageUrl || product.image || '',
      description: product.description || '',
      status: product.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async () => {
    if (!formData.name || formData.price <= 0) {
      message.warning("Vui lòng nhập tên và giá hợp lệ!");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && editingId) {
        await adminService.updateProduct(editingId, formData);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await adminService.createProduct(formData);
        message.success("Đã thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false);
      
      // Delay 500ms trước khi gọi lại API để Database lưu kịp
      setTimeout(() => {
        fetchProducts();
      }, 500);

    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value });
  };

  const getStatusBadge = (stock: number) => {
    if (stock > 10) return <span className="flex items-center gap-1.5 w-max px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black tracking-widest uppercase border border-green-100"><CheckCircle2 size={12}/> Còn hàng</span>;
    if (stock > 0 && stock <= 10) return <span className="flex items-center gap-1.5 w-max px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-black tracking-widest uppercase border border-yellow-100"><AlertCircle size={12}/> Sắp hết</span>;
    return <span className="flex items-center gap-1.5 w-max px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black tracking-widest uppercase border border-red-100"><AlertCircle size={12}/> Hết hàng</span>;
  };

  // ==========================================
  // BỘ LỌC TÌM KIẾM MỚI - SIÊU AN TOÀN (SAFE FILTER)
  // ==========================================
  const filteredProducts = products.filter(p => {
    const searchVal = searchTerm.toLowerCase().trim();
    if (!searchVal) return true; // Nếu ô tìm kiếm trống, hiện tất cả

    // Lấy toàn bộ Giá trị (Values) của object sản phẩm, nối thành 1 chuỗi duy nhất
    // Cách này giúp bạn tìm được cả Tên, ID, Giá, Tồn kho, Phân loại... 
    // Dù Backend trả về dữ liệu kiểu gì cũng bắt được hết!
    const allProductData = JSON.stringify(Object.values(p)).toLowerCase();
    
    return allProductData.includes(searchVal);
  });

  return (
    <div className="space-y-8 pb-10 relative">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>Quản lý Sản phẩm</h1>
          <p className="text-gray-400 font-medium mt-1 text-sm">Hiển thị và cập nhật danh mục mỹ phẩm GLOWLAB.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <button onClick={fetchProducts} className="px-5 py-3 bg-white border border-gray-200 text-[#1E293B] rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">LÀM MỚI</button>
          <button onClick={handleOpenAddModal} className="flex-1 md:flex-none px-6 py-3 bg-[#1E293B] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#86C2A1] transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Tên hoặc Mã sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-transparent rounded-[1.5rem] focus:bg-gray-50 outline-none text-sm font-medium text-[#1E293B] transition-colors"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#86C2A1]" />
            <p className="font-bold">Đang tải dữ liệu từ máy chủ...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Sản phẩm</th>
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Phân loại</th>
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Giá bán</th>
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap text-center">Tồn kho</th>
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Trạng thái</th>
                  <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {/* SỬ DỤNG MẢNG filteredProducts ĐÃ ĐƯỢC LỌC AN TOÀN */}
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100' }}/>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24}/></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E293B] group-hover:text-[#86C2A1] transition-colors">{product.name || product.productName || 'Không có tên'}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {product.id?.substring(0,8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{product.category || 'Mỹ phẩm'}</span>
                      </td>
                      <td className="py-5 px-8">
                        <span className="text-sm font-black text-[#1E293B]">{new Intl.NumberFormat('vi-VN').format(product.price || 0)} đ</span>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <span className={`text-sm font-bold ${(product.stockQuantity || product.stock || 0) > 10 ? 'text-[#1E293B]' : 'text-red-500'}`}>
                          {product.stockQuantity || product.stock || 0}
                        </span>
                      </td>
                      <td className="py-5 px-8">{getStatusBadge(product.stockQuantity || product.stock || 0)}</td>
                      <td className="py-5 px-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEditModal(product)} className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Chỉnh sửa"><Edit size={16} /></button>
                          <Popconfirm title="Xóa sản phẩm" description={`Bạn có chắc chắn muốn xóa "${product.name || 'sản phẩm này'}"?`} onConfirm={() => handleDelete(product.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true, loading: actionLoading === product.id }}>
                            <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Xóa">
                              {actionLoading === product.id ? <Loader2 size={16} className="animate-spin text-red-500"/> : <Trash2 size={16} />}
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && !loading && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B]">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-400 text-sm mt-1">Sản phẩm có thể nằm ở trang khác hoặc sai từ khóa.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#1E293B]/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsModalOpen(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl border border-white overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-black text-[#1E293B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-[#1E293B] rounded-full transition-colors"><X size={20}/></button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tên sản phẩm *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all" placeholder="Nhập tên sản phẩm..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phân loại</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all">
                      <option value="Serum">Serum</option>
                      <option value="Cream">Kem dưỡng</option>
                      <option value="Cleanser">Sữa rửa mặt</option>
                      <option value="Sunscreen">Kem chống nắng</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Giá bán (VNĐ) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Số lượng tồn kho</label>
                    <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Link Hình Ảnh (URL)</label>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mô tả chi tiết</label>
                  <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#86C2A1] outline-none text-sm font-medium transition-all resize-none" placeholder="Công dụng, thành phần..." />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-gray-50/50">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-[#1E293B] transition-colors rounded-xl">Hủy bỏ</button>
                <button onClick={handleSubmitForm} disabled={isSaving} className="px-8 py-3 bg-[#1E293B] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#86C2A1] transition-all flex items-center gap-2">
                  {isSaving && <Loader2 size={16} className="animate-spin"/>}
                  {isEditMode ? 'LƯU THAY ĐỔI' : 'TẠO MỚI'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default AdminProducts;