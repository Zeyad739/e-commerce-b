import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch paginated products with optional search, category, and sorting
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { limit = 12, skip = 0, searchQuery = "", category = "", sortBy = "", order = "asc" } = {},
    { rejectWithValue }
  ) => {
    try {
      let url = "https://dummyjson.com/products";

      if (searchQuery && searchQuery.trim() !== "") {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=${limit}&skip=${skip}`;
      } else if (category && category !== "all") {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(
          category
        )}?limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      if (sortBy && sortBy !== "default") {
        const delimiter = url.includes("?") ? "&" : "?";
        url += `${delimiter}sortBy=${sortBy}&order=${order}`;
      }

      const response = await axios.get(url);
      return {
        products: response.data.products,
        total: response.data.total,
        skip: response.data.skip,
        limit,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://dummyjson.com/products/categories");
      // DummyJSON returns array of objects with { slug, name, url } or array of strings
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Fetch single product details
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://dummyjson.com/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

// Add product (CRUD)
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/products/add",
        productData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// Update product (CRUD)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://dummyjson.com/products/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete product (CRUD)
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `https://dummyjson.com/products/${id}`
      );
      return { id, isDeleted: response.data.isDeleted };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    skip: 0,
    limit: 12,
    categories: [],
    selectedCategory: "all",
    searchQuery: "",
    sortBy: "default",
    sortOrder: "asc",
    selectedProduct: null,
    loading: false,
    detailsLoading: false,
    crudLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.skip = 0; // reset pagination on filter change
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.skip = 0;
    },
    setSorting: (state, action) => {
      const { sortBy, order = "asc" } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = order;
      state.skip = 0;
    },
    setPage: (state, action) => {
      const pageIndex = action.payload; // 0-based
      state.skip = pageIndex * state.limit;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    // Direct local state manipulation for immediate feedback
    addProductLocally: (state, action) => {
      const newProd = {
        ...action.payload,
        id: Date.now(), // fallback id
      };
      state.items.unshift(newProd);
      state.total += 1;
    },
    updateProductLocally: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
      if (state.selectedProduct && state.selectedProduct.id === action.payload.id) {
        state.selectedProduct = { ...state.selectedProduct, ...action.payload };
      }
    },
    deleteProductLocally: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.crudLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.crudLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.error = action.payload;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.crudLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.crudLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.crudLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setSorting,
  setPage,
  clearSelectedProduct,
  addProductLocally,
  updateProductLocally,
  deleteProductLocally,
} = productsSlice.actions;

export default productsSlice.reducer;
