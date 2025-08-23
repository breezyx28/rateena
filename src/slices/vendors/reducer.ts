import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  vendorUpdatedSuccess: false,
  vendorUserAddedSuccess: false,
  vendorCategoriesSuccess: false,
  vendorProductSuccess: false,
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
    },
    vendorsError(state, action) {
      state.vendorError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  vendorsListSuccess,
  vendorsListError,
  vendorCategoriesSuccess,
  vendorSuccess,
  vendorUpdatedSuccess,
  vendorProductsSuccess,
  vendorsError,
  vendorUsersSuccess,
  vendorUserAdded,
  vendorCategoryAdded,
  vendorProductAdded,
} = vendorsSlice.actions;

export default vendorsSlice.reducer;
