import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getNotificationsCountQuery,
  getNotificationsQuery,
  readNotificationQuery,
} from "slices/thunks";
import { toast } from "react-toastify";
import { errorToastManager } from "helpers/error-helper";

interface NotificationState {
  currentState: null | boolean;
  count: null | string | number;
  notificationId: null | string | number;
}

export const useNotificationsState = () => {
  const dispatch: any = useDispatch();

  // notification state management
  const [notificationInfo, setNotificationInfo] = useState<any>([]);
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      currentState: null,
      count: 0,
      notificationId: null,
    }
  );

  // Redux selectors
  const selectLayoutState = (state: any) => state.Notifications;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    notificationError: state.notificationError,
    notificationData: state.notificationData,
    notificationReaded: state.notificationReaded,
    notificationCount: state.notificationCount,
    notificationsListSuccess: state.notificationsListSuccess,
  }));

  const {
    notificationData,
    notificationCount,
    notificationError,
    notificationReaded,
    notificationsListSuccess,
  } = useSelector(selectLayoutProperties);

  // Fetch vendor data
  useEffect(() => {
    dispatch(getNotificationsCountQuery());
    dispatch(getNotificationsQuery());
  }, [dispatch]);

  // Update vendor info when data changes
  useEffect(() => {
    if (notificationsListSuccess?.list) {
      setNotificationInfo(notificationsListSuccess?.list);
    }

    if (notificationCount?.list?.count) {
      console.log("notificationCount: ", notificationCount?.list?.count);
      setNotificationState({
        ...notificationState,
        count: notificationCount?.list?.count,
      });
    }
  }, [notificationData, notificationsListSuccess, notificationCount]);

  useEffect(() => {
    if (notificationReaded) {
      setNotificationState({
        ...notificationState,
        currentState: true,
      });
    }
  }, [notificationReaded]);

  // Handle notifications errors
  useEffect(() => {
    if (notificationError) {
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(notificationError, toast.error);
      setNotificationState({
        currentState: null,
        count: 0,
        notificationId: null,
      });
    }
  }, [notificationError]);

  // Toggle notification
  const toggleNotificationReadStatus = (notificationId: string) => {
    dispatch(readNotificationQuery(notificationId));
  };

  return {
    // State
    notificationsListSuccess,
    notificationState,
    notificationError,
    notificationData,
    notificationReaded,
    notificationCount,
    notificationInfo,

    // Setters
    setNotificationInfo,

    // Actions
    toggleNotificationReadStatus,
    // Dispatch for custom actions
    dispatch,
  };
};
