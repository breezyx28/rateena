import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: false,
  error: false,
  loading: false,
  advertisementsListSuccess: null,
  advertisementUpdatedSuccess: false,
  advertisementData: null,
  advertisementError: null,
};

const advertisementsSlice = createSlice({
  name: "advertisementsList",
  initialState,
  reducers: {
    advertisementSuccess(state, action) {
      state.advertisementData = action.payload;
      state.success = true;
      state.error = false;
    },

    advertisementUpdated(state) {
      state.advertisementUpdatedSuccess = true;
      state.success = true;
      state.error = false;
    },
    advertisementsListSuccess(state, action) {
      state.advertisementsListSuccess = action.payload;
      state.success = true;
      state.error = false;
    },
    advertisementsListError(state, action) {
      state.advertisementError = action.payload;
      state.success = false;
      state.error = true;
    },
    advertisementsError(state, action) {
      state.advertisementError = action.payload;
      state.success = false;
      state.error = true;
    },
    clearAdvertisementError(state) {
      state.advertisementError = null;
      state.error = false;
    },
  },
});

export const {
  advertisementsListSuccess,
  advertisementsListError,
  advertisementSuccess,
  advertisementsError,
  advertisementUpdated,
  clearAdvertisementError,
} = advertisementsSlice.actions;

export default advertisementsSlice.reducer;
