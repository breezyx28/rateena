import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  verifyOtpSuccessMsg: null,
  verifyOtpError: null,
};

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState,
  reducers: {
    userVerifyOtpSuccess(state, action) {
      state.verifyOtpSuccessMsg = action.payload;
      state.success = true;
      state.error = false;
    },
    userVerifyOtpError(state, action) {
      state.verifyOtpError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const { userVerifyOtpSuccess, userVerifyOtpError } =
  verifyOtpSlice.actions;

export default verifyOtpSlice.reducer;
