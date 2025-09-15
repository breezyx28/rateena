import React from "react";
import { Navigate } from "react-router-dom";

// //Dashboard
// import DashboardAnalytics from "../pages/DashboardAnalytics";
// import DashboardCrm from "../pages/DashboardCrm";
// import DashboardEcommerce from "../pages/DashboardEcommerce";

// import DashboardCrypto from "../pages/DashboardCrypto";
// import DashboardProject from "../pages/DashboardProject";
// import DashboardNFT from "../pages/DashboardNFT";
// import DashboardJob from "../pages/DashboardJob/";

// // // Email box
// import MailInbox from "../pages/EmailInbox";
// import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
// import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

// // //Chat
// import Chat from "../pages/Chat";

// // // Project
// import ProjectList from "../pages/Projects/ProjectList";
// import ProjectOverview from "../pages/Projects/ProjectOverview";
// import CreateProject from "../pages/Projects/CreateProject";

// // //Task
// import TaskDetails from "../pages/Tasks/TaskDetails";
// import TaskList from "../pages/Tasks/TaskList";

// // //Transactions
// import Transactions from "../pages/Crypto/Transactions";
// import BuySell from "../pages/Crypto/BuySell";
// import CryproOrder from "../pages/Crypto/CryptoOrder";
// import MyWallet from "../pages/Crypto/MyWallet";
// import ICOList from "../pages/Crypto/ICOList";
// import KYCVerification from "../pages/Crypto/KYCVerification";

// // //Crm Pages
// import CrmCompanies from "../pages/Crm/CrmCompanies";
// import CrmContacts from "../pages/Crm/CrmContacts";
// import CrmDeals from "../pages/Crm/CrmDeals/index";
// import CrmLeads from "../pages/Crm/CrmLeads/index";

// // //Invoices
// import InvoiceList from "../pages/Invoices/InvoiceList";
// import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
// import InvoiceDetails from "../pages/Invoices/InvoiceDetails";

// // // Support Tickets
// import ListView from "../pages/SupportTickets/ListView";
// import TicketsDetails from "../pages/SupportTickets/TicketsDetails";

// // // //Ecommerce Pages
// import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
// import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
// import EcommerceAddProduct from "../pages/Ecommerce/EcommerceProducts/EcommerceAddProduct";
// import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
// import EcommerceOrderDetail from "../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";
// import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
// import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
// import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
// import EcommerceSellers from "../pages/Ecommerce/EcommerceSellers/index";
// import EcommerceSellerDetail from "../pages/Ecommerce/EcommerceSellers/EcommerceSellerDetail";

// // // NFT Marketplace Pages
// import Marketplace from "../pages/NFTMarketplace/Marketplace";
// import Collections from "../pages/NFTMarketplace/Collections";
// import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
// import Creators from "../pages/NFTMarketplace/Creators";
// import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
// import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
// import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
// import Ranking from "../pages/NFTMarketplace/Ranking";
// import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// // // Base Ui
// import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
// import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
// import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
// import UiColors from "../pages/BaseUi/UiColors/UiColors";
// import UiCards from "../pages/BaseUi/UiCards/UiCards";
// import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
// import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
// import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
// import UiImages from "../pages/BaseUi/UiImages/UiImages";
// import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
// import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
// import UiModals from "../pages/BaseUi/UiModals/UiModals";
// import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
// import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
// import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
// import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
// import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
// import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
// import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
// import UiList from "../pages/BaseUi/UiLists/UiLists";
// import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
// import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
// import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// // // Advance Ui
// import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
// import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
// import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
// import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
// import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// // Widgets
// import Widgets from "../pages/Widgets/Index";

// // //Forms
// import BasicElements from "../pages/Forms/BasicElements/BasicElements";
// import FormSelect from "../pages/Forms/FormSelect/FormSelect";
// import FormEditor from "../pages/Forms/FormEditor/FormEditor";
// import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
// import Masks from "../pages/Forms/Masks/Masks";
// import FileUpload from "../pages/Forms/FileUpload/FileUpload";
// import FormPickers from "../pages/Forms/FormPickers/FormPickers";
// import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
// import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
// import FormValidation from "../pages/Forms/FormValidation/FormValidation";
// import FormWizard from "../pages/Forms/FormWizard/FormWizard";
// import FormAdvanced from "../pages/Forms/FormAdvanced/FormAdvanced";
// import Select2 from "../pages/Forms/Select2/Select2";

// // //Tables
// import BasicTables from "../pages/Tables/BasicTables/BasicTables";
// // import ListTables from '../pages/Tables/ListTables/ListTables';
// import ReactTable from "../pages/Tables/ReactTables";

// // //Icon pages
// import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
// import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
// import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
// import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
// import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
// import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";

// // //Maps
// import GoogleMaps from "../pages/Maps/GoogleMaps/GoogleMaps";

// //AuthenticationInner pages
// import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
// import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
// import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
// import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
// import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";
// //pages
// import Starter from "../pages/Pages/Starter/Starter";
// import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
// import Settings from "../pages/Pages/Profile/Settings/Settings";
// import Team from "../pages/Pages/Team/Team";
// import Timeline from "../pages/Pages/Timeline/Timeline";
// import Faqs from "../pages/Pages/Faqs/Faqs";
// import Pricing from "../pages/Pages/Pricing/Pricing";
// import Gallery from "../pages/Pages/Gallery/Gallery";
// import Maintenance from "../pages/Pages/Maintenance/Maintenance";
// import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";
// import SiteMap from "../pages/Pages/SiteMap/SiteMap";
// import SearchResults from "../pages/Pages/SearchResults/SearchResults";

// import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
// import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
// import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
// import BasicLogout from "pages/AuthenticationInner/Logout/BasicLogout";
// import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
// import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
// import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
// import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
// import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
// import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
// import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
// import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
// import Error500 from "../pages/AuthenticationInner/Errors/Error500";

// import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
// import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
// import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// //APi Key
// import APIKey from "../pages/APIKey/index";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// //Charts
// import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
// import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
// import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
// import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
// import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
// import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
// import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
// import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
// import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
// import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
// import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
// import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
// import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
// import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
// import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
// import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";
// import ChartsJs from "../pages/Charts/ChartsJs/index";
// import Echarts from "../pages/Charts/ECharts/index";

// // //Job pages
// import Statistics from "../pages/Jobs/Statistics";
// import JobList from "../pages/Jobs/JobList/List";
// import JobGrid from "../pages/Jobs/JobList/Grid";
// import JobOverview from "../pages/Jobs/JobList/Overview";
// import CandidateList from "../pages/Jobs/CandidateList/ListView";
// import CandidateGrid from "../pages/Jobs/CandidateList/GridView";
// import NewJobs from "../pages/Jobs/NewJob";
// import JobCategories from "../pages/Jobs/JobCategories";
// import Application from "../pages/Jobs/Application";
// import CompaniesList from "../pages/Jobs/CompaniesList";

// // Landing Index
// import OnePage from "../pages/Landing/OnePage";
// import NFTLanding from "../pages/Landing/NFTLanding";
// import JobLanding from "../pages/Job_Landing/Job";

import PrivacyPolicy from "../pages/Pages/PrivacyPolicy";
// import TermsCondition from "../pages/Pages/TermsCondition";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

// import RangeArea from "../pages/Charts/ApexCharts/RangeAreaCharts/Index";
// import FunnelChart from "../pages/Charts/ApexCharts/FunnelCharts/Index";
// import FileManager from "../pages/FileManager";
// import ToDoList from "../pages/ToDo";
// import UiLink from "../pages/BaseUi/UiLinks/UiLinks";
// import Kanbanboard from "pages/Tasks/KanbanBoard";
// import BlogListView from "pages/Pages/Blogs/ListView";
// import BlogGridView from "pages/Pages/Blogs/GridView";
// import PageBlogOverview from "pages/Pages/Blogs/Overview";
// import SlopeCharts from "pages/Charts/ApexCharts/SlopeCharts";
// import DashboardBlog from "pages/DashboardBlog";
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
  { path: "/register", component: <Register /> },
  { path: "/privacy-policy", component: <PrivacyPolicy /> },
  { path: "/auth-401", component: <Alt401 /> },
  // --------------------------------------------------------
];

export { authProtectedRoutes, publicRoutes };
