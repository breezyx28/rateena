import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

export const postLogin = (data: any) => api.create(url.POST_LOGIN, data);
export const postVerifyOTP = (data: any) =>
  api.create(url.POST_VERIFY_OTP, data);
export const postSendOTP = (data: any) => api.create(url.POST_SEND_OTP, data);
export const postResetPassword = (data: any) =>
  api.create(url.POST_RESET_PASSWORD, data);
export const postLogout = () => api.create(url.POST_LOGOUT, {});
export const postRefreshToken = (data: any) =>
  api.create(url.POST_REFRESH_TOKEN, data);
export const getProfile = () => api.get(url.GET_PROFILE);
