import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem("ecommerce_cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Helper to save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("ecommerce_cart", JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
};

// Calculate totals helper
const calculateTotals = (items, discountPercent = 0) => {
  const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalAmount = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = totalAmount - discountAmount;
  return {
    totalQuantity,
    totalAmount: Number(totalAmount.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2)),
  };
};

const initialItems = loadCartFromStorage();
const initialTotals = calculateTotals(initialItems, 0);

// Fetch all carts from DummyJSON API
export const fetchApiCarts = createAsyncThunk(
  "cart/fetchApiCarts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://dummyjson.com/carts");
      return response.data.carts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load API carts");
    }
  }
);

// Fetch carts by user ID
export const fetchUserCarts = createAsyncThunk(
  "cart/fetchUserCarts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://dummyjson.com/carts/user/${userId}`);
      return response.data.carts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user carts");
    }
  }
);

// Add cart to API
export const addCartApi = createAsyncThunk(
  "cart/addCartApi",
  async ({ userId, products }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://dummyjson.com/carts/add", {
        userId,
        products,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to save cart to server");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: initialItems,
    totalQuantity: initialTotals.totalQuantity,
    totalAmount: initialTotals.totalAmount,
    discountPercent: 0,
    discountAmount: initialTotals.discountAmount,
    finalAmount: initialTotals.finalAmount,
    promoCode: "",
    apiCarts: [],
    userCarts: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const quantityToAdd = product.quantityToAdd || 1;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || product.images?.[0] || "",
          category: product.category || "",
          stock: product.stock ?? 99,
          quantity: quantityToAdd,
        });
      }

      const totals = calculateTotals(state.items, state.discountPercent);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      const totals = calculateTotals(state.items, state.discountPercent);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items, state.discountPercent);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
      saveCartToStorage(state.items);
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }

      const totals = calculateTotals(state.items, state.discountPercent);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discountPercent = 0;
      state.discountAmount = 0;
      state.finalAmount = 0;
      state.promoCode = "";
      saveCartToStorage([]);
    },
    applyPromoCode: (state, action) => {
      const code = (action.payload || "").toUpperCase().trim();
      let percent = 0;
      if (code === "SAVE10" || code === "WELCOME10") {
        percent = 10;
      } else if (code === "SAVE20" || code === "SUPER20") {
        percent = 20;
      } else if (code === "HALF50") {
        percent = 50;
      }

      state.promoCode = code;
      state.discountPercent = percent;

      const totals = calculateTotals(state.items, percent);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      state.discountAmount = totals.discountAmount;
      state.finalAmount = totals.finalAmount;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchApiCarts
      .addCase(fetchApiCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.apiCarts = action.payload;
      })
      .addCase(fetchApiCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUserCarts
      .addCase(fetchUserCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.userCarts = action.payload;
      })
      .addCase(fetchUserCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  decrementQuantity,
  clearCart,
  applyPromoCode,
} = cartSlice.actions;

export default cartSlice.reducer;
