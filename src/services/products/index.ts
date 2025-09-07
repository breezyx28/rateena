import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

// Product API functions
export const getProducts = () => api.get(url.PRODUCTS_ROUTE_URL);

export const getProduct = (productId: any) =>
  api.get(url.PRODUCTS_ROUTE_URL.concat(`/${productId}`));

export const deleteProduct = (productId: any) =>
  api.delete(
    url.PRODUCT_DELETE_URL.replace("{productId}", productId.toString())
  );

export const addOption = (data: any) =>
  api.create(url.ADD_OPTION_INFO_URL, data);

export const deleteOption = (optionId: any) =>
  api.delete(url.OPTION_DELETE_URL.replace("{optionId}", optionId));

export const toggleProductPublish = (productId: any) =>
  api.get(url.TOGGLE_PUBLISH_URL.replace("{productId}", productId.toString()));

export const toggleProductApprove = (productId: any) =>
  api.get(
    url.TOGGLE_PRODUCT_APPROVE_URL.replace("{productId}", productId.toString())
  );

export const addProductImage = (productId: any, data: any) =>
  api.create(
    url.ADD_IIMAGE_URL.replace("{productId}", productId.toString()),
    data
  );

export const removeProductImage = (productId: any, imagePath: string) =>
  api.delete(
    url.REMOVE_IIMAGE_URL.replace("{productId}", productId.toString()).replace(
      "${imagePath}",
      imagePath
    )
  );
