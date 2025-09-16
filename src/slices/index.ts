import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";

import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ResetPasswordReducer from "./auth/reset-password/reducer";
import VerifyOtpReducer from "./auth/verifyOtp/reducer";
import ProfileReducer from "./auth/profile/reducer";

import LoadingReducer from "./loadingSlice";

// Home
import HomeDetailsReducer from "./Home/reducer";

// Notifications
import NotificationsReducer from "./notifications/reducer";

// Vendors
import VendorsReducer from "./vendors/reducer";

// Customers
import CustomersReducer from "./customers/reducer";

// Admin Users
import AdminUsersReducer from "./users/reducer";

// Orders
import OrdersReducer from "./orders/reducer";

// Products
import ProductsReducer from "./products/reducer";

// Advertisement
import AdvertisementsReducer from "./advertisements/reducer";

const rootReducer = combineReducers({
  Loading: LoadingReducer,
  Layout: LayoutReducer,
  Login: LoginReducer,
  VerifyOtp: VerifyOtpReducer,
  ForgetPassword: ForgetPasswordReducer,
  ResetPassword: ResetPasswordReducer,
  Profile: ProfileReducer,
  Products: ProductsReducer,
  HomeDetails: HomeDetailsReducer,
  Vendors: VendorsReducer,
  Orders: OrdersReducer,
  AdminUsers: AdminUsersReducer,
  Customers: CustomersReducer,
  Advertisements: AdvertisementsReducer,
  Notifications: NotificationsReducer,
});

export default rootReducer;
