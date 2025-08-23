import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  ordersListSuccess: null,
  orderData: null,
  orderInvoiceData: null,
  orderError: null,
};

const ordersSlice = createSlice({
  name: "ordersList",
  initialState,
  reducers: {
    orderSuccess(state, action) {
      state.orderData = action.payload;
      state.success = true;
      state.error = false;
    },
    orderInvoice(state, action) {
      state.orderInvoiceData = action.payload;
      state.success = true;
      state.error = false;
    },

    orderUpdated(state) {
      state.success = true;
      state.error = false;
    },
    ordersListSuccess(state, action) {
      state.ordersListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    ordersListError(state, action) {
      state.orderError = action.payload;
      state.success = false;
      state.error = true;
    },
    ordersError(state, action) {
      state.orderError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  ordersListSuccess,
  ordersListError,
  orderSuccess,
  ordersError,
  orderUpdated,
  orderInvoice,
} = ordersSlice.actions;

export default ordersSlice.reducer;
