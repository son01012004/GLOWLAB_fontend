import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand?: string;
}

// 1. Hàm đọc giỏ hàng từ LocalStorage khi khởi động
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('glowlab_cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Lỗi đọc LocalStorage", error);
  }
  return { items: [] as CartItem[], totalAmount: 0 };
};

// 2. Hàm lưu giỏ hàng xuống LocalStorage mỗi khi có thay đổi
const saveCartToStorage = (state: any) => {
  localStorage.setItem('glowlab_cart', JSON.stringify(state));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const existingItem = state.items.find((item: CartItem) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          imageUrl: action.payload.imageUrl || action.payload.image, // Dự phòng 2 trường hợp tên biến
          brand: action.payload.brand || 'GLOWLAB PURE',
          quantity: 1 
        });
      }
      state.totalAmount = state.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      saveCartToStorage(state); // LƯU SAU KHI THÊM
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find((item: CartItem) => item.id === action.payload);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
      state.totalAmount = state.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      saveCartToStorage(state); // LƯU SAU KHI GIẢM
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item: CartItem) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
      saveCartToStorage(state); // LƯU SAU KHI XÓA
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('glowlab_cart'); // XÓA SẠCH LÚC THANH TOÁN XONG
    }
  }
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;