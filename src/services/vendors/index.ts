import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getVendorsList = () => api.get(url.GET_VENDORS_LIST);
export const getVendor = (vendorId: any) =>
  api.get(url.GET_VENDOR.replace("{vendorId}", vendorId));
export const getVendorProducts = (vendorId: number) =>
  api.get(url.GET_VENDOR_PRODUCTS.replace("{vendorId}", vendorId.toString()));
export const getVendorUsers = (vendorId: any) =>
  api.get(url.GET_VENDOR_USERS.replace("{vendorId}", vendorId));
export const getVendorCategories = (vendorId: number) =>
  api.get(url.GET_VENDOR_CATEGORIES.replace("{vendorId}", vendorId.toString()));
export const toggleVendorCategory = (categoryId: number) =>
  api.get(
    url.GET_VENDOR_TOGGLE_CATEGORY.replace(
      "{categoryId}",
      categoryId.toString()
    )
  );
export const getVendorToggleActivation = (vendorId: number) =>
  api.get(
    url.GET_VENDOR_TOGGLE_ACTIVATION.replace("{vendorId}", vendorId.toString())
  );
export const deleteVendor = (vendorId: any) =>
  api.delete(url.DELETE_VENDOR.replace("{vendorId}", vendorId.toString()));
export const postAddVendor = (data: any) =>
  api.create(url.POST_VENDOR_ADD, data);
export const postAddVendorUser = (data: any) =>
  api.create(url.POST_VENDOR_ADD_USER, data);
export const putUpdateVendorUser = (data: any) =>
  api.create(url.PUT_VENDOR_UPDATE_USER, data);
export const deleteVendorUser = (userId: any) =>
  api.delete(url.DELETE_VENDOR_USER.replace("{userId}", userId.toString()));
export const postAddVendorCategory = (data: any) =>
  api.create(url.POST_VENDOR_ADD_CATEGORY, data);
export const putUpdateVendorCategory = (data: any) =>
  api.create(url.PUT_VENDOR_UPDATE_CATEGORY, data);
export const deleteVendorCategory = (categoryId: any) =>
  api.delete(
    url.DELETE_VENDOR_CATEGORY.replace("{categoryId}", categoryId.toString())
  );
export const postAddVendorProduct = (data: any) =>
  api.create(url.POST_VENDOR_ADD_PRODUCTS, data);
