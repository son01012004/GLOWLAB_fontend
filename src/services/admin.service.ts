import axiosClient from '../utils/axios';

export const adminService = {
  // 1. Thống kê
  getDashboardStats: async () => {
    const res: any = await axiosClient.get('/admin/dashboard');
    return res.data !== undefined ? res.data : res;
  },

  // 2. Lấy đơn hàng (FIX LỖI UNDEFINED Ở ĐÂY)
  getAllOrders: async () => {
    const res: any = await axiosClient.get('/admin/orders');
    return res.data !== undefined ? res.data : res;
  },

  // 3. Cập nhật trạng thái đơn
  updateOrderStatus: async (orderId: string, status: string) => {
    const res: any = await axiosClient.put(`/admin/orders/${orderId}/status?status=${status}`);
    return res.data !== undefined ? res.data : res;
  },

  // 4. Thêm sản phẩm
  createProduct: async (data: any) => {
    const res: any = await axiosClient.post('/admin/products', data);
    return res.data !== undefined ? res.data : res;
  },

  // 5. Cập nhật sản phẩm
  updateProduct: async (id: string, data: any) => {
    const res: any = await axiosClient.put(`/admin/products/${id}`, data);
    return res.data !== undefined ? res.data : res;
  },

  // 6. Xóa sản phẩm
  deleteProduct: async (id: string) => {
    const res: any = await axiosClient.delete(`/admin/products/${id}`);
    return res.data !== undefined ? res.data : res;
  },

  // 7. Lấy danh sách Users
  getAllUsers: async () => {
    const res: any = await axiosClient.get('/admin/users');
    return res.data !== undefined ? res.data : res;
  }
};