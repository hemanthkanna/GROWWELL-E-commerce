import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Ensure DevTools work in development mode
});

export default store;
