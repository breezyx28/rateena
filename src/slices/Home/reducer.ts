import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  homeDetailsSuccess: null,
  homeDetailsError: null,
};

const homeDetailsSlice = createSlice({
  name: "homeDetails",
  initialState,
  reducers: {
    homeDetailsSuccess(state, action) {
      state.homeDetailsSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    homeDetailsError(state, action) {
      state.homeDetailsError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const { homeDetailsSuccess, homeDetailsError } =
  homeDetailsSlice.actions;

export default homeDetailsSlice.reducer;
