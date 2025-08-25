import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  restPasswordError: null,
  restPasswordSuccess: false,
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false,
  isUserLogout: true,
};

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    resetPasswordUserSuccessful(state: any, action: any) {
      state.user = action.payload.user;
      state.loading = false;
      state.success = true;
      state.restPasswordSuccess = true;
      state.restPasswordError = null;
    },
    resetPasswordUserFailed(state: any, action: any) {
      state.user = null;
      state.loading = false;
      state.restPasswordError = action.payload;
      state.restPasswordSuccess = false;
      state.error = true;
    },
    resetResetPasswordFlagChange(state: any) {
      state.success = false;
      state.error = false;
    },
    apiErrorChange(state: any, action: any) {
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
    },
  },
});

export const {
  apiErrorChange,
  resetPasswordUserFailed,
  resetPasswordUserSuccessful,
  resetResetPasswordFlagChange,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
