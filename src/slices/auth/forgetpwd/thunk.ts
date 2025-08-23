import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer";
import { postSendOTP } from "services/Auth";

export const userForgetPassword =
  (user: any, history: any) => async (dispatch: any) => {
    try {
      let response;

      response = postSendOTP({ phone: user.phone });

      const data = await response;

      if (data) {
        dispatch(userForgetPasswordSuccess(data));

        sessionStorage.setItem("forgot-password-data", JSON.stringify(data));
      }
    } catch (forgetError) {
      dispatch(userForgetPasswordError(forgetError));
    }
  };
