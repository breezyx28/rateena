import {
  advertisementSuccess,
  advertisementUpdated,
  advertisementsError,
  advertisementsListError,
  advertisementsListSuccess,
  clearAdvertisementError,
} from "./reducer";
import {
  getAdvertisement,
  getAdvertisementToggle,
  getAdvertisementsList,
  postDeleteAdvertisement,
  postAddOrUpdateAdvertisement,
} from "services/advertisements";

export const getAdvertisementsListQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getAdvertisementsList();

    const data = await response;

    if (data) {
      dispatch(advertisementsListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(advertisementsListError(error));
  }
};

export const getAdvertisementQuery =
  (advertisementId: any) => async (dispatch: any) => {
    try {
      let response;

      response = getAdvertisement(advertisementId);

      const data = await response;

      if (data) {
        dispatch(advertisementSuccess(data));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(advertisementsListError(error));
    }
  };

export const toggleAdvertisementQuery =
  (advertisementId: any) => async (dispatch: any) => {
    try {
      let response;
      response = getAdvertisementToggle(advertisementId);
      const data = await response;
      if (data) {
        dispatch(advertisementSuccess(data));
        try {
          dispatch(getAdvertisementsListQuery);
        } catch (advertisementError) {
          throw advertisementError;
        }
      }
    } catch (error: any) {
      console.log("errors: ", error);
      dispatch(advertisementsListError(error));
    }
  };

export const addOrUpdateAdvertisementMutation =
  (body: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors
      dispatch(clearAdvertisementError());

      let response;

      response = postAddOrUpdateAdvertisement(body);

      const data = await response;

      if (data) {
        dispatch(advertisementUpdated());
        dispatch(getAdvertisementsListQuery());
      }
    } catch (error: any) {
      console.log("Advertisement API Error: ", error);

      dispatch(advertisementsError(error));
    }
  };
export const deleteAdvertisementMutation =
  (advertisementId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postDeleteAdvertisement(advertisementId);

      const data = await response;

      if (data) {
        dispatch(advertisementUpdated());
        try {
          dispatch(getAdvertisementsListQuery);
        } catch (advertisementError) {
          throw advertisementError;
        }
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(advertisementsError(error));
    }
  };
