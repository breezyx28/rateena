import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  productsListSuccess: null,
  productUpdatedSuccess: false,
  productData: null,
  productError: null,
};

const productsSlice = createSlice({
  name: "productReducer",
  initialState,
  reducers: {
    productSuccess(state, action) {
      state.productData = action.payload;
      state.success = true;
      state.error = false;
    },

    productUpdated(state) {
      state.productUpdatedSuccess = true;
      state.success = true;
      state.error = false;
    },
    productsListSuccess(state, action) {
      state.productsListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    productsListError(state, action) {
      state.productError = action.payload;
      state.success = false;
      state.error = true;
    },
    productsError(state, action) {
      state.productError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  productsListSuccess,
  productsListError,
  productSuccess,
  productsError,
  productUpdated,
} = productsSlice.actions;

export default productsSlice.reducer;
