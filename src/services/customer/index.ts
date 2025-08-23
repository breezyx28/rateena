import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getCustomersList = () => api.get(url.GET_CUSTOMERS_LIST);
export const getCustomer = (customerId: any) =>
  api.get(url.GET_CUSTOMER.replace("{customerId}", customerId));

export const postCustomerBlock = (customerId: any) =>
  api.create(
    url.POST_CUSTOMER_BLOCK.replace("{customerId}", customerId.toString()),
    {}
  );
export const postCustomerUnBlock = (customerId: number) =>
  api.create(
    url.POST_CUSTOMER_UNBLOCK.replace("{customerId}", customerId.toString()),
    {}
  );
export const postUpdateCustomer = (data: any) =>
  api.create(url.POST_CUSTOMER_UPDATE, data);
export const postDeleteCustomer = (customerId: any) =>
  api.delete(
    url.POST_CUSTOMER_DELETE.replace("{customerId}", customerId.toString()),
    {}
  );
