// action
import {
  resetPasswordUserFailed,
  resetPasswordUserSuccessful,
  resetResetPasswordFlagChange,
} from "./reducer";
import { postResetPassword } from "services/Auth";

// Is user register successfull then direct plot user in redux.
export const resetUserPassword = (user: any) => async (dispatch: any) => {
  try {
    let response;

    response = postResetPassword(user);
    const data: any = await response;

    if (data.message === "success") {
      dispatch(resetPasswordUserSuccessful(data));
      sessionStorage.removeItem("forgot-password-data");
    } else {
      dispatch(resetPasswordUserFailed(data));
    }
  } catch (error: any) {
    dispatch(resetPasswordUserFailed(error));
  }
};

export const resetRestPasswordFlag = () => {
  try {
    const response = resetResetPasswordFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};
