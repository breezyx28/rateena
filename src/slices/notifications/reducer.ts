import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  notificationAdded: false,
  notificationReaded: false,
  notificationsListSuccess: null,
  notificationCount: null,
  notificationData: null,
  notificationError: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationSuccess(state, action) {
      state.notificationData = action.payload;
      state.success = true;
      state.error = false;
    },

    notificationReaded(state) {
      state.notificationReaded = true;
      state.success = true;
      state.error = false;
    },
    notificationCount(state, action) {
      state.notificationCount = action.payload;
      state.success = true;
      state.error = false;
    },

    notificationsListSuccess(state, action) {
      state.notificationsListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    notificationsListError(state, action) {
      state.notificationError = action.payload;
      state.success = false;
      state.error = true;
    },
    notificationsError(state, action) {
      state.notificationError = action.payload;
      state.success = false;
      state.error = true;
    },
  },
});

export const {
  notificationsListSuccess,
  notificationsListError,
  notificationSuccess,
  notificationCount,
  notificationsError,
  notificationReaded,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
