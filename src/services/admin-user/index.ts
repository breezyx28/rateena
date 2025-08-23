import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getAdminUsersList = () => api.get(url.GET_USERS_LIST);
export const getAdminUser = (userId: any) =>
  api.get(url.GET_USER.replace("{userId}", userId));

export const postAddOrUpdateAdminUser = (data: any) =>
  api.create(url.POST_USER_CREATE_OR_UPDATE, data);
export const postResetAdminUserPassword = (data: any) =>
  api.create(url.POST_RESET_USERS_PASSWORD, data);
export const postDeleteAdminUser = (userId: any) =>
  api.delete(url.POST_USER_DELETE.replace("{userId}", userId.toString()), {});
