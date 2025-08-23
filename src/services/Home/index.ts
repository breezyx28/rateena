import { APIClient } from "../api-handles";

import * as url from "../api-endpoints";

const api = new APIClient();

export const getHomeDetails = () => api.get(url.GET_HOME_DETAILS);
