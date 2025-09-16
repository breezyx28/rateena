import React from "react";
import { Navigate } from "react-router-dom";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

import ResetPassword from "pages/Authentication/ResetPassword";
import VerifyUser from "pages/Authentication/VerifyUser";
import Alt401 from "pages/AuthenticationInner/Errors/Alt401";
import AdminUsers from "pages/AdminUsers";
import Customers from "pages/Customers";
import CustomersOrders from "pages/CustomersOrders";
import Vendors from "pages/Vendors";
import VendorProfile from "pages/Vendors/vendor-profile";
import Advertisements from "pages/Advertisements";
import CustomerOrderInvoiceDetails from "pages/CustomersOrders/CustomerOrderInvoiceDetails";
import Dashboard from "pages/Dashboard";
import VendorAdd from "pages/Vendors/vendor-add";
import VendorProductDetails from "pages/Vendors/vendor-product-details";
import Products from "pages/Products";
import PrivacyPolicy from "pages/pages/PrivacyPolicy";

const authProtectedRoutes = [
  // Admin Pages
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/dashboard/admin-users", component: <AdminUsers /> },
  { path: "/dashboard/vendors", component: <Vendors /> },
  { path: "/dashboard/vendors/add", component: <VendorAdd /> },
  { path: "/dashboard/vendors/:vendorId", component: <VendorProfile /> },

  {
    path: "/dashboard/vendors/:vendorId/product/:productId",
    component: <VendorProductDetails />,
  },
  { path: "/dashboard/customers", component: <Customers /> },
  { path: "/dashboard/customers/orders", component: <CustomersOrders /> },
  {
    path: "/dashboard/customers/orders/:orderId",
    component: <CustomerOrderInvoiceDetails />,
  },
  { path: "/dashboard/advertisements", component: <Advertisements /> },
  { path: "/index", component: <Dashboard /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/reset-password", component: <ResetPassword /> },
  { path: "/verify-user", component: <VerifyUser /> },
  { path: "/verify", component: <VerifyUser /> },
  { path: "/privacy-policy", component: <PrivacyPolicy /> },
  { path: "/auth-401", component: <Alt401 /> },
  // --------------------------------------------------------
];

export { authProtectedRoutes, publicRoutes };
