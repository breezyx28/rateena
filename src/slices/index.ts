import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
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

//Invoice
import InvoiceReducer from "./invoice/reducer";

//Calendar
import CalendarReducer from "./calendar/reducer";
//Chat
import chatReducer from "./chat/reducer";
//Ecommerce
import EcommerceReducer from "./ecommerce/reducer";

//Project
import ProjectsReducer from "./projects/reducer";

// Tasks
import TasksReducer from "./tasks/reducer";

//Crypto
import CryptoReducer from "./crypto/reducer";

//TicketsList
import TicketsReducer from "./tickets/reducer";
//Crm
import CrmReducer from "./crm/reducer";

//Mailbox
import MailboxReducer from "./mailbox/reducer";

// Dashboard Analytics
import DashboardAnalyticsReducer from "./dashboardAnalytics/reducer";

// Dashboard CRM
import DashboardCRMReducer from "./dashboardCRM/reducer";

// // Dashboard Ecommerce
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";

// Dashboard Cryto
import DashboardCryptoReducer from "./dashboardCrypto/reducer";

// Dashboard Cryto
import DashboardProjectReducer from "./dashboardProject/reducer";

// Dashboard NFT
import DashboardNFTReducer from "./dashboardNFT/reducer";

// Dashboard JOb
import DashboardJobReducer from "./dashboardJob/reducer";

// Pages > Team
import TeamDataReducer from "./team/reducer";

// File Manager
import FileManagerReducer from "./fileManager/reducer";

// To do
import TodosReducer from "./todos/reducer";

// Job
import JobReducer from "./jobs/reducer";

// API Key
import APIKeyReducer from "./apiKey/reducer";

const rootReducer = combineReducers({
  Loading: LoadingReducer,
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
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
  Invoice: InvoiceReducer,
  Calendar: CalendarReducer,
  Chat: chatReducer,
  Projects: ProjectsReducer,
  Ecommerce: EcommerceReducer,
  Tasks: TasksReducer,
  Crypto: CryptoReducer,
  Tickets: TicketsReducer,
  Crm: CrmReducer,
  Mailbox: MailboxReducer,
  DashboardAnalytics: DashboardAnalyticsReducer,
  DashboardCRM: DashboardCRMReducer,
  DashboardEcommerce: DashboardEcommerceReducer,
  DashboardCrypto: DashboardCryptoReducer,
  DashboardProject: DashboardProjectReducer,
  DashboardNFT: DashboardNFTReducer,
  DashBoardJob: DashboardJobReducer,
  Team: TeamDataReducer,
  FileManager: FileManagerReducer,
  Todos: TodosReducer,
  Jobs: JobReducer,
  APIKey: APIKeyReducer,
});

export default rootReducer;
