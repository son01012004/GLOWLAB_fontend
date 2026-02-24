import api from '../utils/axios';

export const productService = {
  // Khớp với ProductController: @GetMapping("/api/v1/products")
  getAllProducts: async (params?: { 
    keyword?: string, 
    brand?: string, 
    skinType?: string, 
    page?: number, 
    size?: number 
  }) => {
    return await api.get('/products', { params });
  },

  // Khớp với ProductController: @GetMapping("/api/v1/products/{id}")
  getProductById: async (id: string) => {
    return await api.get(`/products/${id}`);
  },

  // Khớp với RecommendationController: @GetMapping("/api/v1/routines/recommendation")
  getRoutineRecommendation: async () => {
    return await api.get('/routines/recommendation');
  }
};