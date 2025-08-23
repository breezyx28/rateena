import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  customersListSuccess: null,
  customerData: null,
  customerError: null,
};

const customersSlice = createSlice({
  name: "customersList",
  initialState,
  reducers: {
    customerSuccess(state, action) {
      state.customerData = action.payload;
      state.success = true;
      state.error = false;
    },

    customerUpdated(state) {
      state.success = true;
      state.error = false;
    },

    customersListSuccess(state, action) {
      state.customersListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    customersListError(state, action) {
      state.customerError = action.payload;
      state.success = false;
      state.error = true;
    },
    customersError(state, action) {
      state.customerError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  customersListSuccess,
  customersListError,
  customerSuccess,
  customersError,
  customerUpdated,
} = customersSlice.actions;

export default customersSlice.reducer;
