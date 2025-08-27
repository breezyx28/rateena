import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getOrdersList = () => api.get(url.GET_ORDERS_LIST);
export const getOrder = (orderId: any) =>
  api.get(url.GET_ORDER.replace("{orderId}", orderId));
export const getOrderInvoice = (orderId: any) =>
  api.get(url.GET_ORDER_INVOICE.replace("{orderId}", orderId));

// export const postCustomerBlock = (customerId: any) =>
//   api.create(
//     url.POST_CUSTOMER_BLOCK.replace("{customerId}", customerId.toString()),
//     {}
//   );
// export const postCustomerUnBlock = (customerId: number) =>
//   api.create(
//     url.POST_CUSTOMER_UNBLOCK.replace("{customerId}", customerId.toString()),
//     {}
//   );
// export const postUpdateCustomer = (data: any) =>
//   api.create(url.POST_CUSTOMER_UPDATE, data);
// export const postDeleteCustomer = (customerId: any) =>
//   api.delete(
//     url.POST_CUSTOMER_DELETE.replace("{customerId}", customerId.toString()),
//     {}
//   );
