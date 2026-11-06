import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("ecommerce_theme") === "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDark: initialTheme,
  },
  reducers: {
    toggle: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem("ecommerce_theme", state.isDark ? "dark" : "light");
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem("ecommerce_theme", action.payload ? "dark" : "light");
    },
  },
});

export const { toggle, setTheme } = themeSlice.actions;
export default themeSlice.reducer;