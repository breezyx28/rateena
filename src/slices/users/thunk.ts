import {
  adminUserAdded,
  adminUserSuccess,
  adminUserUpdated,
  adminUsersError,
  adminUsersListError,
  adminUsersListSuccess,
} from "./reducer";
import {
  getAdminUser,
  getAdminUsersList,
  postAddOrUpdateAdminUser,
  postDeleteAdminUser,
  postResetAdminUserPassword,
} from "services/admin-user";

export const getAdminUsersListQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getAdminUsersList();

    const data = await response;

    if (data) {
      dispatch(adminUsersListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(adminUsersListError(error));
  }
};

export const getAdminUserQuery = (userId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getAdminUser(userId);

    const data = await response;

    if (data) {
      dispatch(adminUserSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(adminUsersListError(error));
  }
};

export const addOrUpdateUserMutation = (body: any) => async (dispatch: any) => {
  try {
    let response;

    response = postAddOrUpdateAdminUser(body);

    const data = await response;

    if (data) {
      if (body?.userId) {
        dispatch(adminUserUpdated());
      } else {
        dispatch(adminUserAdded());
      }
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(adminUsersError(error));
  }
};

export const deleteAdminUserMutation =
  (userId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postDeleteAdminUser({ userId });

      const data = await response;

      if (data) {
        dispatch(adminUserUpdated());
        dispatch(getAdminUsersListQuery());
      }
    } catch (error: any) {
      console.log("errors: ", error);
      dispatch(adminUsersError(error));
    }
  };

export const resetAdminUserPasswordMutation =
  (body: any) => async (dispatch: any) => {
    try {
      let response;

      response = postResetAdminUserPassword(body);

      const data = await response;

      if (data) {
        dispatch(adminUserUpdated());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(adminUsersError(error));
    }
  };
