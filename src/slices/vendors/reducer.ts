import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  vendorUpdatedSuccess: false,
  vendorUserAddedSuccess: false,
  vendorCategoriesSuccess: false,
  vendorProductSuccess: false,
  vendorProductUpdateSuccess: false,
  vendorProductUpdateError: false,
  vendorsListSuccess: null,
  vendorProducts: null,
  vendorUsers: null,
  vendorCategories: null,
  vendorData: null,
  vendorError: null,
};

const vendorsSlice = createSlice({
  name: "vendorsList",
  initialState,
  reducers: {
    vendorSuccess(state, action) {
      state.vendorData = action.payload;
      state.success = true;
      state.error = false;
    },
    vendorLoading(state) {
      state.loading = true;
    },
    vendorUsersSuccess(state, action) {
      state.vendorUsers = action.payload;
      state.success = true;
      state.error = false;
    },
    vendorUserAdded(state) {
      state.vendorUserAddedSuccess = true;
      state.success = true;
      state.error = false;
    },
    vendorCategoryAdded(state) {
      state.vendorCategoriesSuccess = true;
      state.success = true;
      state.error = false;
    },
    vendorProductAdded(state) {
      state.vendorProductSuccess = true;
      state.success = true;
      state.error = false;
      state.loading = false;
    },
    vendorProductUpdated(state) {
      state.vendorProductUpdateSuccess = true;
      state.success = true;
      state.error = false;
      state.loading = false;
    },
    vendorsListSuccess(state, action) {
      state.vendorsListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    vendorUpdatedSuccess(state) {
      state.vendorUpdatedSuccess = true;
      state.success = true;
      state.error = false;
    },
    vendorProductsSuccess(state, action) {
      state.vendorProducts = action.payload;
      state.success = true;
      state.error = false;
    },
    vendorCategoriesSuccess(state, action) {
      state.vendorCategories = action.payload;
      state.success = true;
      state.error = false;
    },
    vendorsListError(state, action) {
      state.vendorError = action.payload;
      state.success = false;
      state.error = true;
      state.loading = false;
    },
    vendorsError(state, action) {
      state.vendorError = action.payload;
      state.success = false;
      state.error = true;
      state.loading = false;
    },
    clearVendorError(state) {
      state.vendorError = null;
      state.error = false;
    },
    resetVendorStates(state) {
      state.vendorUserAddedSuccess = false;
      state.vendorCategoriesSuccess = false;
      state.vendorProductUpdateSuccess = false;
      state.vendorProductSuccess = false;
      state.vendorUpdatedSuccess = false;
      state.success = false;
      state.vendorError = null;
      state.error = false;
    },
  },
});

export const {
  vendorsListSuccess,
  vendorsListError,
  vendorLoading,
  vendorCategoriesSuccess,
  vendorSuccess,
  vendorUpdatedSuccess,
  vendorProductsSuccess,
  vendorsError,
  vendorUsersSuccess,
  vendorUserAdded,
  vendorCategoryAdded,
  vendorProductAdded,
  vendorProductUpdated,
  clearVendorError,
  resetVendorStates,
} = vendorsSlice.actions;

export default vendorsSlice.reducer;
