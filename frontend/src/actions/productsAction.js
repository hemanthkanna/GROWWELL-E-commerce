import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Products Thunk
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/products");
      return response.data; // This becomes the payload
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
