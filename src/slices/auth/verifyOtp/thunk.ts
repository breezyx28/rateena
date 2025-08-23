import { userVerifyOtpError, userVerifyOtpSuccess } from "./reducer";
import { postVerifyOTP } from "services/Auth";

export const forgotPasswordSessionData = sessionStorage.getItem(
  "forgot-password-data"
)
  ? JSON.parse(sessionStorage.getItem("forgot-password-data") ?? "")
  : {};

export const userVerifyOtp = (user: any) => async (dispatch: any) => {
  try {
    let response;

    const payload = {
      phone: forgotPasswordSessionData?.phone.toString(),
      key_ref: forgotPasswordSessionData?.keyRef?.split(" ")?.shift(), // remove split in production
      code: user.OTP?.toString(),
    };

    response = postVerifyOTP(payload);

    const data = await response;

    if (data) {
      dispatch(userVerifyOtpSuccess(data));

      setTimeout(() => {
        window.location.href = "/reset-password";
      }, 1500);
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(userVerifyOtpError(error));
  }
};
