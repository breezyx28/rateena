import {
  getVendorsList,
  getVendor as getVendorApi,
  getVendorUsers as getVendorUsersApi,
  postAddVendorUser,
  putUpdateVendorUser,
  deleteVendorUser,
  getVendorCategories,
  postAddVendorCategory,
  putUpdateVendorCategory,
  deleteVendorCategory,
  getVendorProducts,
  postAddVendorProduct,
  postAddVendor,
  getVendorToggleActivation,
  deleteVendor,
  toggleVendorCategory,
} from "services/vendors";
import {
  vendorsListSuccess,
  vendorsListError,
  vendorSuccess,
  vendorUsersSuccess,
  vendorsError,
  vendorUserAdded,
  vendorCategoriesSuccess,
  vendorCategoryAdded,
  vendorProductsSuccess,
  vendorProductAdded,
  vendorUpdatedSuccess,
  clearVendorError,
  clearVendorSuccess,
} from "./reducer";

export const vendorsList = () => async (dispatch: any) => {
  try {
    let response;

    response = getVendorsList();

    const data = await response;

    if (data) {
      dispatch(vendorsListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(vendorsListError(error));
  }
};

export const getVendor = (vendorId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getVendorApi(vendorId);

    const data = await response;

    if (data) {
      dispatch(vendorSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(vendorsListError(error));
  }
};

export const toggleVendorStateQuery =
  (vendorId: any) => async (dispatch: any) => {
    try {
      let response;

      response = getVendorToggleActivation(vendorId);

      const data = await response;

      if (data) {
        dispatch(vendorSuccess(data));
        dispatch(vendorsList());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsListError(error));
    }
  };

export const getVendorUsers = (vendorId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getVendorUsersApi(vendorId);

    const data = await response;

    if (data) {
      dispatch(vendorUsersSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(vendorsError(error));
  }
};

export const addVendorMutation = (formData: any) => async (dispatch: any) => {
  try {
    // Clear any previous errors before starting
    dispatch(clearVendorError());

    let response;

    response = postAddVendor(formData);

    const data = await response;

    if (data) {
      dispatch(vendorSuccess(data));
      dispatch(vendorUpdatedSuccess());
      dispatch(vendorsList());
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(vendorsError(error));
  }
};

export const addVendorUserMutation =
  (body: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = postAddVendorUser({ ...body, vendorId });

      const data = await response;

      if (data) {
        dispatch(vendorUserAdded());
        dispatch(getVendorUsers(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const updateVendorUserMutation =
  (body: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = putUpdateVendorUser({ ...body, vendorId });

      const data = await response;

      if (data) {
        dispatch(vendorUserAdded());
        dispatch(getVendorUsers(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const deleteVendorUserMutation =
  (userId: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = deleteVendorUser(userId);

      const data = await response;

      if (data) {
        dispatch(vendorUserAdded());
        dispatch(getVendorUsers(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const getVendorCategoriesQuery =
  (vendorId: any) => async (dispatch: any) => {
    try {
      let response;

      response = getVendorCategories(vendorId);

      const data = await response;

      if (data) {
        dispatch(vendorCategoriesSuccess(data));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const toggleVendorCategoryQuery =
  (categoryId: any) => async (dispatch: any) => {
    try {
      let response;

      response = toggleVendorCategory(categoryId);

      const data = await response;

      if (data) {
        dispatch(vendorCategoriesSuccess(data));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const addVendorCategoryMutation =
  (body: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = postAddVendorCategory({ ...body, vendor_id: vendorId });

      const data = await response;

      if (data) {
        dispatch(vendorCategoryAdded());
        dispatch(getVendorCategoriesQuery(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const updateVendorCategoryMutation =
  (body: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = putUpdateVendorCategory({ ...body, vendor_id: vendorId });

      const data = await response;

      if (data) {
        dispatch(vendorCategoryAdded());
        dispatch(getVendorCategoriesQuery(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const deleteVendorCategoryMutation =
  (categoryId: any, vendorId: any) => async (dispatch: any) => {
    try {
      // Clear any previous errors before starting
      dispatch(clearVendorError());

      let response;

      response = deleteVendorCategory(categoryId);

      const data = await response;

      if (data) {
        dispatch(vendorCategoryAdded());
        dispatch(getVendorCategoriesQuery(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const getVendorProductsQuery =
  (vendorId: any) => async (dispatch: any) => {
    try {
      let response;

      response = getVendorProducts(vendorId);

      const data = await response;

      if (data) {
        dispatch(vendorProductsSuccess(data));
      }
    } catch (error: any) {
      console.log("getVendorProductsQuery-errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const addVendorProductMutation =
  (body: any, vendorId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postAddVendorProduct(body);

      const data = await response;

      if (data) {
        dispatch(vendorProductAdded());
        dispatch(getVendorProductsQuery(vendorId));
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };

export const deleteVendorMutation =
  (vendorId: any) => async (dispatch: any) => {
    try {
      let response;

      response = deleteVendor(vendorId);

      const data = await response;

      if (data) {
        dispatch(vendorUpdatedSuccess());
        dispatch(vendorsList());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(vendorsError(error));
    }
  };
