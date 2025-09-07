import {
  notificationCount,
  notificationReaded,
  notificationSuccess,
  notificationsError,
  notificationsListError,
  notificationsListSuccess,
} from "./reducer";
import {
  getNotifications,
  getNotificationsCount,
  getReadNotification,
} from "services/notifications";

export const getNotificationsQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getNotifications();

    const data = await response;

    if (data) {
      dispatch(notificationsListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(notificationsListError(error));
  }
};
export const getNotificationsCountQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getNotificationsCount();

    const data = await response;

    if (data) {
      dispatch(notificationCount(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(notificationsError(error));
  }
};

export const readNotificationQuery =
  (notificationId: any) => async (dispatch: any) => {
    try {
      let response;

      response = getReadNotification(notificationId);

      const data = await response;

      if (data) {
        dispatch(notificationSuccess(data));
        dispatch(notificationReaded());
        dispatch(getNotificationsQuery());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(notificationsListError(error));
    }
  };
