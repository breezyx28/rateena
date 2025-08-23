import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getAdvertisementsList = () => api.get(url.GET_ADVERTISEMENTS_LIST);
export const getAdvertisement = (advertisementId: any) =>
  api.get(url.GET_ADVERTISEMENT.replace("{advertisementId}", advertisementId));
export const getAdvertisementToggle = (advertisementId: any) =>
  api.get(
    url.GET_TOGGLE_ADVERTISEMENTS.replace("{advertisementId}", advertisementId)
  );

export const postAddOrUpdateAdvertisement = (data: any) =>
  api.create(url.POST_ADVERTISEMENT, data);
export const postDeleteAdvertisement = (advertisementId: any) =>
  api.delete(
    url.POST_ADVERTISEMENT_DELETE.replace(
      "{advertisementId}",
      advertisementId.toString()
    ),
    {}
  );
