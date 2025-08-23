import {
  customersError,
  customersListError,
  customersListSuccess,
  customerSuccess,
  customerUpdated,
} from "./reducer";
import {
  getCustomersList,
  getCustomer as getCustomerApi,
  postCustomerBlock,
  postCustomerUnBlock,
  postDeleteCustomer,
  postUpdateCustomer,
} from "services/customer";

export const getCustomersListQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getCustomersList();

    const data = await response;

    if (data) {
      dispatch(customersListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(customersListError(error));
  }
};

export const getCustomer = (customerId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getCustomerApi(customerId);

    const data = await response;

    if (data) {
      dispatch(customerSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(customersListError(error));
  }
};

export const updateCustomerMutation =
  (body: any, customerId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postUpdateCustomer({ ...body, customerId });

      const data = await response;

      if (data) {
        dispatch(customerUpdated());
        let customers;
        try {
          customers = getCustomerApi(customerId);
          const customersData = await response;
          dispatch(customerSuccess(customersData));
        } catch (customerError) {
          throw customerError;
        }
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(customersError(error));
    }
  };

export const deleteCustomerMutation =
  (customerId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postDeleteCustomer({ customerId });

      const data = await response;

      if (data) {
        dispatch(customerUpdated());
        let customers;
        try {
          customers = getCustomersList();
          const customersDataList = await customers;

          if (customersDataList) {
            dispatch(customersListSuccess(customersDataList));
          }
        } catch (customerError) {
          throw customerError;
        }
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(customersError(error));
    }
  };

export const blockCustomerMutation =
  (customerId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postCustomerBlock(customerId);

      const data = await response;

      if (data) {
        dispatch(customerUpdated());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(customersError(error));
    }
  };

export const unblockCustomerMutation =
  (customerId: any) => async (dispatch: any) => {
    try {
      let response;

      response = postCustomerUnBlock(customerId);

      const data = await response;

      if (data) {
        dispatch(customerUpdated());
      }
    } catch (error: any) {
      console.log("errors: ", error);

      dispatch(customersError(error));
    }
  };
