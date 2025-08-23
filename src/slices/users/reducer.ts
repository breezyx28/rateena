import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  adminUserAdded: false,
  adminUserUpdated: false,
  adminUsersListSuccess: null,
  adminUserData: null,
  adminUserError: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    adminUserSuccess(state, action) {
      state.adminUserData = action.payload;
      state.success = true;
      state.error = false;
    },

    adminUserUpdated(state) {
      state.adminUserUpdated = true;
      state.success = true;
      state.error = false;
    },
    adminUserAdded(state) {
      state.adminUserAdded = true;
      state.success = true;
      state.error = false;
    },

    adminUsersListSuccess(state, action) {
      state.adminUsersListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    adminUsersListError(state, action) {
      state.adminUserError = action.payload;
      state.success = false;
      state.error = true;
    },
    adminUsersError(state, action) {
      state.adminUserError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  adminUsersListSuccess,
  adminUsersListError,
  adminUserSuccess,
  adminUsersError,
  adminUserUpdated,
  adminUserAdded,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
