import {
  ordersError,
  orderSuccess,
  orderUpdated,
  ordersListError,
  ordersListSuccess,
  orderInvoice,
} from "./reducer";
import {
  getOrder as getOrderApi,
  getOrderInvoice,
  getOrdersList,
} from "services/orders";

export const getOrdersListQuery = () => async (dispatch: any) => {
  try {
    let response;

    response = getOrdersList();

    const data = await response;

    if (data) {
      dispatch(ordersListSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(ordersListError(error));
  }
};

export const getOrder = (orderId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getOrderApi(orderId);

    const data = await response;

    if (data) {
      dispatch(orderSuccess(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(ordersListError(error));
  }
};

export const getOrderInvoiceQuery = (orderId: any) => async (dispatch: any) => {
  try {
    let response;

    response = getOrderInvoice(orderId);

    const data = await response;

    if (data) {
      dispatch(orderInvoice(data));
    }
  } catch (error: any) {
    console.log("errors: ", error);

    dispatch(ordersListError(error));
  }
};
