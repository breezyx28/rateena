import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

//import images
import progileBg from "../../assets/images/profile-bg.jpg";
import VendorProducts from "./vendor-products";
import VendorCategories from "./vendor-categories";
import VendorUsers from "./vendor-users";
import { imgURL } from "services/api-handles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getVendor,
  addVendorMutation,
  toggleVendorStateQuery,
} from "slices/thunks";
import { toast, ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import VendorUploadFiles from "./vendor-upload-files";
import VendorMap from "./vendor-map";
import {
  supportedRegions,
  supportedVendorType,
} from "./validation/vendor-validation";

const VendorProfile = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const [selectedCoords, setSelectedCoords] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [activeTab, setActiveTab] = useState("1");
  const [vendorInfo, setVendorInfo] = useState(location.state ?? {});

  const [files, setFiles] = useState({
    licenseImageFile: null,
    identityImageFile: null,
  });

  // State for vendor status toggle
  const [vendorState, setVendorState] = useState<{
    currentState: null | boolean;
    vendorId: null | string | number;
  }>({
    currentState: null,
    vendorId: null,
  });

  // Initial values for vendor info form
  const getInitialValues = () => ({
    fullName: vendorInfo?.fullName || "",
    arFullName: vendorInfo?.arFullName || "",
    userPhone: vendorInfo?.userPhone || "",
    userEmail: vendorInfo?.userEmail || "",
    maxKilometerDelivery: vendorInfo?.maxKilometerDelivery || "",
    minChargeLongDistance: vendorInfo?.minChargeLongDistance || "",
    fOpeningTime: vendorInfo?.fOpeningTime || "",
    fClosingTime: vendorInfo?.fClosingTime || "",
    region: vendorInfo?.region || "",
    vendorType: vendorInfo?.vendorType || "",
  });

  // Validation schema for vendor info form
  const vendorInfoValidationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "English name must be at least 2 characters")
      .max(50, "English name must be less than 50 characters")
      .required("English name is required"),
    arFullName: Yup.string()
      .min(2, "Arabic name must be at least 2 characters")
      .max(50, "Arabic name must be less than 50 characters")
      .required("Arabic name is required"),
    userPhone: Yup.string()
      .matches(
        /^[0-9+\-\s()]+$/,
        "Phone number must contain only numbers, +, -, spaces, and parentheses"
      )
      .min(8, "Phone number must be at least 8 characters")
      .max(20, "Phone number must be less than 20 characters")
      .required("Phone number is required"),
    userEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    maxKilometerDelivery: Yup.number()
      .positive("Max kilometer delivery must be positive")
      .max(1000, "Max kilometer delivery cannot exceed 1000")
      .required("Max kilometer delivery is required"),
    minChargeLongDistance: Yup.number()
      .positive("Min charge for long distance must be positive")
      .max(10000, "Min charge for long distance cannot exceed 10000")
      .required("Min charge for long distance is required"),
    fOpeningTime: Yup.string().required("Opening time is required"),
    fClosingTime: Yup.string().required("Closing time is required"),
    region: Yup.string().required("Region is required"),
    vendorType: Yup.string().required("Vendor type is required"),
  });

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random background color for initials
  const getRandomColor = (name: string) => {
    if (!name) return "#6c757d"; // Default gray color if no name

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
      "#F1948A",
      "#85C1E9",
      "#D7BDE2",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const dispatch: any = useDispatch();

  // Toggle vendor working status
  const toggleVendorStatus = (vendorId: string, currentStatus: boolean) => {
    dispatch(toggleVendorStateQuery(vendorId));
    setVendorState({
      vendorId,
      currentState: !currentStatus,
    });
    toast.success(`Vendor status updated successfully!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle profile image upload
  const handleProfileImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("vendorId", vendorId || "");
      formData.append("profileImage", file);

      dispatch(addVendorMutation(formData));

      toast.success("Profile image updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("vendorId", vendorId || "");
      formData.append("coverImage", file);

      dispatch(addVendorMutation(formData));

      toast.success("Cover image updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle vendor info form submission with Formik
  const handleVendorInfoSubmit = (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    const formData = new FormData();
    formData.append("vendorId", vendorId || "");

    // Add form values to FormData
    Object.keys(values).forEach((key) => {
      if (
        values[key] !== undefined &&
        values[key] !== null &&
        values[key] !== ""
      ) {
        formData.append(key, values[key]);
      }
    });

    // Add coordinates if selected
    if (
      selectedCoords &&
      typeof selectedCoords === "object" &&
      "lat" in selectedCoords &&
      "lng" in selectedCoords
    ) {
      formData.append("lat", selectedCoords.lat.toString());
      formData.append("lng", selectedCoords.lng.toString());
    }

    // Add files if uploaded
    if (files.licenseImageFile) {
      formData.append("licenseImage", files.licenseImageFile);
    }
    if (files.identityImageFile) {
      formData.append("identityImage", files.identityImageFile);
    }

    dispatch(addVendorMutation(formData));

    toast.success("Vendor information updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    setSubmitting(false);
  };

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorData: state.vendorData,
  }));
  // Inside your component
  const { vendorError, vendorData } = useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (vendorId) {
      dispatch(getVendor(vendorId));
    }
  }, [dispatch, vendorId]);

  React.useEffect(() => {
    if (vendorData?.vendor && vendorData.vendor !== vendorInfo) {
      setVendorInfo(vendorData.vendor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorData]);

  React.useEffect(() => {
    if (vendorError) {
      console.log("vendorError: ", vendorError);
      setVendorState({
        currentState: null,
        vendorId: null,
      });
    }
  }, [vendorError]);

  document.title = "Vendor Profile | Rateena - E-Shop Admin Panel";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img
                src={
                  vendorInfo?.profileImage
                    ? imgURL + "/" + vendorInfo?.coverImage
                    : progileBg
                }
                className="profile-wid-img"
                alt=""
              />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input
                      id="profile-foreground-img-file-input"
                      type="file"
                      className="profile-foreground-img-file-input"
                      onChange={handleCoverImageUpload}
                      accept="image/*"
                    />
                    <Label
                      htmlFor="profile-foreground-img-file-input"
                      className="profile-photo-edit btn btn-light"
                    >
                      <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                      Change Cover
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5 card-bg-fill">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      {vendorInfo?.profileImage ? (
                        <img
                          src={imgURL + "/" + vendorInfo?.profileImage}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                          alt="vendor-profile"
                        />
                      ) : (
                        <div
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: getRandomColor(
                              i18n.dir() === "ltr"
                                ? vendorInfo?.fullName || ""
                                : vendorInfo?.arFullName || ""
                            ),
                            color: "white",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            width: "80px",
                            height: "80px",
                          }}
                        >
                          {getInitials(
                            i18n.dir() === "ltr"
                              ? vendorInfo?.fullName || ""
                              : vendorInfo?.arFullName || ""
                          )}
                        </div>
                      )}
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                          onChange={handleProfileImageUpload}
                          accept="image/*"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">
                      {i18n.dir() === "ltr"
                        ? vendorInfo?.fullName
                        : vendorInfo?.arFullName}
                    </h5>
                    <p className="text-muted mb-0">{vendorInfo?.vendorType}</p>

                    {/* Vendor Status Toggle */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Label className="form-check-label mb-0 small">
                          Status:
                        </Label>
                        <div className="form-check form-switch">
                          <Input
                            className="form-check-input"
                            type="switch"
                            id={`vendor-status-${vendorId}`}
                            checked={
                              vendorState?.vendorId === vendorId
                                ? vendorState?.currentState
                                : vendorInfo?.working
                            }
                            onChange={() =>
                              toggleVendorStatus(
                                vendorId || "",
                                vendorInfo?.working || false
                              )
                            }
                          />
                        </div>
                        <small className="text-muted">
                          {vendorState?.vendorId === vendorId
                            ? vendorState?.currentState
                              ? "Active"
                              : "Inactive"
                            : vendorInfo?.working
                            ? "Active"
                            : "Inactive"}
                        </small>
                      </div>
                    </div>

                    {/* Opening/Closing Times */}
                    {(vendorInfo?.fOpeningTime || vendorInfo?.fClosingTime) && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          {vendorInfo?.fOpeningTime && (
                            <div className="d-flex align-items-center gap-1">
                              <i className="las la-clock text-success"></i>
                              <small className="text-muted">
                                Opens: {vendorInfo.fOpeningTime}
                              </small>
                            </div>
                          )}
                          {vendorInfo?.fClosingTime && (
                            <div className="d-flex align-items-center gap-1">
                              <i className="las la-clock text-danger"></i>
                              <small className="text-muted">
                                Closes: {vendorInfo.fClosingTime}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5 card-bg-fill">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Personal Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Change Password
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          tabChange("3");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Products
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          tabChange("4");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Categories
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => {
                          tabChange("5");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Users
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Formik
                        initialValues={getInitialValues()}
                        validationSchema={vendorInfoValidationSchema}
                        onSubmit={handleVendorInfoSubmit}
                        enableReinitialize={true}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                        }) => (
                          <Form id="vendor-info-form" onSubmit={handleSubmit}>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="englishfullnameInput"
                                    className="form-label"
                                  >
                                    English Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className={`form-control ${
                                      errors.fullName && touched.fullName
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="englishfullnameInput"
                                    placeholder="Enter English Full Name"
                                    name="fullName"
                                    value={values.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="fullName"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="arabicfullnameInput"
                                    className="form-label"
                                  >
                                    Arabic Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className={`form-control ${
                                      errors.arFullName && touched.arFullName
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="arabicfullnameInput"
                                    placeholder="Enter Arabic Full Name"
                                    name="arFullName"
                                    value={values.arFullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="arFullName"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="phonenumberInput"
                                    className="form-label"
                                  >
                                    Phone Number
                                  </Label>
                                  <Input
                                    type="text"
                                    className={`form-control ${
                                      errors.userPhone && touched.userPhone
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="phonenumberInput"
                                    placeholder="Enter your phone number"
                                    name="userPhone"
                                    value={values.userPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="userPhone"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="emailInput"
                                    className="form-label"
                                  >
                                    Email Address
                                  </Label>
                                  <Input
                                    type="email"
                                    className={`form-control ${
                                      errors.userEmail && touched.userEmail
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="emailInput"
                                    placeholder="Enter your email"
                                    name="userEmail"
                                    value={values.userEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="userEmail"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="maxkilometerdelivery"
                                    className="form-label"
                                  >
                                    Max Kilometer Delivery
                                  </Label>
                                  <Input
                                    type="number"
                                    className={`form-control ${
                                      errors.maxKilometerDelivery &&
                                      touched.maxKilometerDelivery
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="maxkilometerdelivery"
                                    name="maxKilometerDelivery"
                                    placeholder="Enter max Kilometer Delivery"
                                    value={values.maxKilometerDelivery}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="maxKilometerDelivery"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="minchargeforlongdistance"
                                    className="form-label"
                                  >
                                    Min Charge For Long Distances
                                  </Label>
                                  <Input
                                    type="number"
                                    className={`form-control ${
                                      errors.minChargeLongDistance &&
                                      touched.minChargeLongDistance
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="minchargeforlongdistance"
                                    name="minChargeLongDistance"
                                    placeholder="Enter min Charge for Long Distance"
                                    value={values.minChargeLongDistance}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name="minChargeLongDistance"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="openingtimeinput"
                                    className="form-label"
                                  >
                                    Opening Time
                                  </Label>
                                  <Flatpickr
                                    className={`form-control ${
                                      errors.fOpeningTime &&
                                      touched.fOpeningTime
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    type="time"
                                    value={values.fOpeningTime}
                                    onChange={(date) =>
                                      setFieldValue(
                                        "fOpeningTime",
                                        date[0]
                                          ? date[0].toTimeString().slice(0, 8)
                                          : ""
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur({
                                        target: { name: "fOpeningTime" },
                                      })
                                    }
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i:S",
                                      time_24hr: true,
                                    }}
                                  />
                                  <ErrorMessage
                                    name="fOpeningTime"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="closingtimeinput"
                                    className="form-label"
                                  >
                                    Closing Time
                                  </Label>
                                  <Flatpickr
                                    className={`form-control ${
                                      errors.fClosingTime &&
                                      touched.fClosingTime
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    type="time"
                                    value={values.fClosingTime}
                                    onChange={(date) =>
                                      setFieldValue(
                                        "fClosingTime",
                                        date[0]
                                          ? date[0].toTimeString().slice(0, 8)
                                          : ""
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur({
                                        target: { name: "fClosingTime" },
                                      })
                                    }
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i:S",
                                      time_24hr: true,
                                    }}
                                  />
                                  <ErrorMessage
                                    name="fClosingTime"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="regionInput"
                                    className="form-label"
                                  >
                                    Region
                                  </Label>
                                  <select
                                    className={`form-select ${
                                      errors.region && touched.region
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    name="region"
                                    value={values.region}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select Region</option>
                                    {supportedRegions.map((region) => (
                                      <option
                                        key={region.id}
                                        value={region.value}
                                      >
                                        {region.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ErrorMessage
                                    name="region"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col lg={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="vendorTypeInput"
                                    className="form-label"
                                  >
                                    Vendor Type
                                  </Label>
                                  <select
                                    className={`form-select ${
                                      errors.vendorType && touched.vendorType
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    name="vendorType"
                                    value={values.vendorType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select Vendor Type</option>
                                    {supportedVendorType.map((type) => (
                                      <option key={type.id} value={type.value}>
                                        {type.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ErrorMessage
                                    name="vendorType"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              {/* files upload should be here */}
                              <VendorUploadFiles
                                files={files}
                                uploadedFiles={setFiles}
                                defaultValues={{
                                  license: vendorInfo?.licenseImage ?? null,
                                  identity: vendorInfo?.identityImage ?? null,
                                }}
                              />

                              <VendorMap
                                selectedCoords={setSelectedCoords}
                                currentCoords={
                                  vendorInfo?.lat
                                    ? {
                                        lat: vendorInfo?.lat,
                                        lng: vendorInfo?.lng,
                                      }
                                    : undefined
                                }
                              />
                              <Col lg={12}>
                                <div className="hstack gap-2 justify-content-end">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting
                                      ? "Updating..."
                                      : "Update Vendor Info"}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-soft-success"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </TabPane>

                    <TabPane tabId="2">
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="oldpasswordInput"
                                className="form-label"
                              >
                                Old Password*
                              </Label>
                              <Input
                                type="password"
                                className="form-control"
                                id="oldpasswordInput"
                                placeholder="Enter current password"
                              />
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="newpasswordInput"
                                className="form-label"
                              >
                                New Password*
                              </Label>
                              <Input
                                type="password"
                                className="form-control"
                                id="newpasswordInput"
                                placeholder="Enter new password"
                              />
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="confirmpasswordInput"
                                className="form-label"
                              >
                                Confirm Password*
                              </Label>
                              <Input
                                type="password"
                                className="form-control"
                                id="confirmpasswordInput"
                                placeholder="Confirm password"
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="mb-3">
                              <Link
                                to="#"
                                className="link-primary text-decoration-underline"
                              >
                                Forgot Password ?
                              </Link>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="text-end">
                              <button type="button" className="btn btn-success">
                                Change Password
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <div className="mt-4 mb-3 border-bottom pb-2">
                        <div className="float-end">
                          <Link to="#" className="link-primary">
                            All Logout
                          </Link>
                        </div>
                        <h5 className="card-title">Login History</h5>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
                            <i className="ri-smartphone-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>iPhone 12 Pro</h6>
                          <p className="text-muted mb-0">
                            Los Angeles, United States - March 16 at 2:47PM
                          </p>
                        </div>
                        <div>
                          <Link to="#">Logout</Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
                            <i className="ri-tablet-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Apple iPad Pro</h6>
                          <p className="text-muted mb-0">
                            Washington, United States - November 06 at 10:43AM
                          </p>
                        </div>
                        <div>
                          <Link to="#">Logout</Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
                            <i className="ri-smartphone-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Galaxy S21 Ultra 5G</h6>
                          <p className="text-muted mb-0">
                            Conneticut, United States - June 12 at 3:24PM
                          </p>
                        </div>
                        <div>
                          <Link to="#">Logout</Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
                            <i className="ri-macbook-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Dell Inspiron 14</h6>
                          <p className="text-muted mb-0">
                            Phoenix, United States - July 26 at 8:10AM
                          </p>
                        </div>
                        <div>
                          <Link to="#">Logout</Link>
                        </div>
                      </div>
                    </TabPane>

                    <TabPane tabId="3">
                      <VendorProducts />
                    </TabPane>

                    <TabPane tabId="4">
                      <VendorCategories />
                    </TabPane>
                    <TabPane tabId="5">
                      <VendorUsers />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorProfile;
