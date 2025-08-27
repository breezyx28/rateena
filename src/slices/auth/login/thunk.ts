import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
  setLoading,
} from "./reducer";
import { postLogin } from "services/Auth";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
  try {
    let response;

    response = postLogin({
      phone: user.phone,
      password: user.password,
    });

    dispatch(setLoading(true));

    var data = await response;
    if (data) {
      sessionStorage.setItem("authUser", JSON.stringify(data));

      // @ts-ignore
      if (data?.role !== "SUPERADMIN") {
        throw new Error("You are not authorized to access this application");
      }

      dispatch(loginSuccess(data));
      setTimeout(() => {
        history("/dashboard");
      }, 1000);
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    sessionStorage.removeItem("authUser");

    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch: any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
