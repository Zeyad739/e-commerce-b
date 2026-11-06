import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./Slices/themeSlice";
import productsReducer from "./Slices/productsSlice";
import cartReducer from "./Slices/cartSlice";
import usersReducer from "./Slices/usersSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    products: productsReducer,
    cart: cartReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});