import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getNotifications = () => api.get(url.GET_NOTIFICATIONS);
export const getNotificationsCount = () => api.get(url.GET_NOTIFICATIONS_COUNT);
export const getReadNotification = (notificationId: any) =>
  api.get(
    url.GET_READ_NOTIFICATION.replace("{notificationId}", notificationId)
  );
