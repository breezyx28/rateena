import React from "react";
import {
  Col,
  Container,
  Row,
  Form,
  Label,
  Input,
  FormFeedback,
  Button,
  Card,
  CardBody,
  Alert,
} from "reactstrap";
import { Formik, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addVendorMutation } from "slices/thunks";
import { clearVendorError, resetVendorStates } from "slices/vendors/reducer";
import Swal from "sweetalert2";
import { createSelector } from "reselect";
import VendorMap from "./vendor-map";
import VendorUploadFiles from "./vendor-upload-files";
import {
  mapServerErrorsToFormik,
  errorToastManager,
} from "helpers/error-helper";
import {
  supportedRegions,
  supportedVendorType,
} from "./validation/vendor-validation";
import { useTranslation } from "react-i18next";

const VendorAdd = () => {
  const { t } = useTranslation();
  document.title = "Add Vendor | Rateena - E-Shop Admin Panel";

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [files, setFiles] = React.useState<any>({
    licenseImageFile: null,
    identityImageFile: null,
    profileImageFile: null,
    coverImageFile: null,
  });
  const [selectedCoords, setSelectedCoords] = React.useState<any>(undefined);

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorUpdatedSuccess: state.vendorUpdatedSuccess,
    vendorError: state.vendorError,
    isLoading: state.isLoading,
  }));

  const { vendorUpdatedSuccess, vendorError, isLoading } = useSelector(
    selectLayoutProperties
  );

  const alertShownRef = React.useRef({ success: false, error: false });

  React.useEffect(() => {
    if (vendorUpdatedSuccess) {
      if (!alertShownRef.current.success) {
        alertShownRef.current.success = true;
        Swal.fire({
          icon: "success",
          title: t("Success!"),
          text: t("Vendor added successfully"),
          showCancelButton: true,
          confirmButtonText: t("Go to Vendors List"),
          cancelButtonText: t("Stay Here"),
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#6c757d",
        }).then((result) => {
          alertShownRef.current.success = false;
          dispatch(resetVendorStates());
          if (result.isConfirmed) {
            navigate("/dashboard/vendors");
          }
        });
        dispatch(clearVendorError());
        errorToastManager.clearLastError();
      }
    }
    if (vendorError) {
      if (!alertShownRef.current.error) {
        alertShownRef.current.error = true;
        Swal.fire({
          icon: "error",
          title: t("Error!"),
          text:
            vendorError?.message ||
            t("Failed to add vendor. Please try again."),
          confirmButtonText: t("OK"),
        }).then(() => {
          alertShownRef.current.error = false;
          dispatch(clearVendorError());
        });
      }
    }
  }, [vendorUpdatedSuccess, vendorError, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(clearVendorError());
      errorToastManager.clearLastError();
    };
  }, [dispatch]);

  const getInitialValues = () => ({
    fullName: "",
    arFullName: "",
    userPhone: "",
    userEmail: "",
    password: "",
    maxKilometerDelivery: "",
    minChargeLongDistance: "",
    openingTime: "",
    closingTime: "",
    always_open: false,
    region: "",
    vendorType: "",
  });

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
    password: Yup.string().min(8).required("Password is required"),
    maxKilometerDelivery: Yup.number()
      .min(1, "Max kilometer delivery must be at least 1")
      .max(1000, "Max kilometer delivery must be less than 1000")
      .required("Max kilometer delivery is required")
      .typeError("Max kilometer delivery must be a number"),
    minChargeLongDistance: Yup.number()
      .min(0, "Min charge for long distance must be at least 0")
      .max(10000, "Min charge for long distance must be less than 10000")
      .required("Min charge for long distance is required")
      .typeError("Min charge for long distance must be a number"),
    always_open: Yup.boolean().required("Always open status is required"),
    openingTime: Yup.string().when("always_open", {
      is: false,
      then: (schema) => schema.required("Opening time is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    closingTime: Yup.string().when("always_open", {
      is: false,
      then: (schema) => schema.required("Closing time is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    region: Yup.string().required("Region is required"),
    vendorType: Yup.string().required("Vendor type is required"),
  });

  const ServerErrorHandler = () => {
    const { setErrors } = useFormikContext<any>();

    React.useEffect(() => {
      if (vendorError) {
        const fieldMapping = {
          identityImage: "identityImageFile",
          licenseImage: "licenseImageFile",
          profileImage: "profileImageFile",
          coverImage: "coverImageFile",
          phone: "userPhone",
          email: "userEmail",
        } as const;
        mapServerErrorsToFormik(vendorError, setErrors, fieldMapping as any);
      }
    }, [vendorError, setErrors]);

    return null;
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to add this vendor?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, Add Vendor"),
      cancelButtonText: t("Cancel"),
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: t("Adding..."),
        text: t("Please wait while we add the vendor."),
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      dispatch(clearVendorError());
      errorToastManager.clearLastError();

      const vendorPayload: any = {
        fullName: values.fullName,
        arFullName: values.arFullName,
        phone: values.userPhone,
        email: values.userEmail,
        password: values.password,
        maxKilometerDelivery: parseInt(values.maxKilometerDelivery),
        openingTime: values.openingTime,
        closingTime: values.closingTime,
        region: values.region,
        vendorType: values.vendorType,
        always_open: values.always_open,
        minChargeLongDistance: parseInt(values.minChargeLongDistance),
      };

      if (
        selectedCoords &&
        typeof selectedCoords === "object" &&
        "lat" in selectedCoords &&
        "lng" in selectedCoords
      ) {
        vendorPayload.lat = selectedCoords.lat;
        vendorPayload.lng = selectedCoords.lng;
      }

      const formData = new FormData();
      formData.append("VendorPayload", JSON.stringify(vendorPayload));

      if (files?.licenseImageFile) {
        formData.append("licenseImage", files.licenseImageFile);
      }
      if (files?.identityImageFile) {
        formData.append("identityImage", files.identityImageFile);
      }
      if (files?.profileImageFile) {
        formData.append("profileImage", files.profileImageFile);
      }
      if (files?.coverImageFile) {
        formData.append("coverImage", files.coverImageFile);
      }

      dispatch(addVendorMutation(formData));
      // resetForm();
      // setFiles({
      //   licenseImageFile: null,
      //   identityImageFile: null,
      //   profileImageFile: null,
      //   coverImageFile: null,
      // });
      // setSelectedCoords(undefined);
    }
    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <Formik
                initialValues={getInitialValues()}
                validationSchema={vendorInfoValidationSchema}
                onSubmit={handleSubmit}
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
                }) => {
                  // Debug Yup validation errors
                  console.log("Formik Validation Errors:", errors);
                  console.log("Formik Touched Fields:", touched);
                  console.log("Formik Values:", values);

                  return (
                    <Form id="vendor-info-form" onSubmit={handleSubmit}>
                      <ServerErrorHandler />

                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              htmlFor="englishfullnameInput"
                              className="form-label"
                            >
                              {t("English Name")}
                            </Label>
                            <Input
                              type="text"
                              className={`form-control ${
                                errors.fullName && touched.fullName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="englishfullnameInput"
                              placeholder={t("Enter English Full Name")}
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
                              {t("Arabic Name")}
                            </Label>
                            <Input
                              type="text"
                              className={`form-control ${
                                errors.arFullName && touched.arFullName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="arabicfullnameInput"
                              placeholder={t("Enter Arabic Full Name")}
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
                              {t("Phone Number")}
                            </Label>
                            <Input
                              type="text"
                              className={`form-control ${
                                errors.userPhone && touched.userPhone
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="phonenumberInput"
                              placeholder={t("Enter your phone number")}
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
                            <Label htmlFor="emailInput" className="form-label">
                              {t("Email Address")}
                            </Label>
                            <Input
                              type="email"
                              className={`form-control ${
                                errors.userEmail && touched.userEmail
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="emailInput"
                              placeholder={t("Enter your email")}
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

                        <Col lg={12}>
                          <div className="mb-3">
                            <Label
                              htmlFor="passwordinput"
                              className="form-label"
                            >
                              {t("Password")}
                            </Label>
                            <Input
                              type="password"
                              className={`form-control ${
                                errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="passwordinput"
                              placeholder={t("Enter your password")}
                              name="password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="password"
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
                              {t("Max Kilometer Delivery")}
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
                              placeholder={t("Enter max Kilometer Delivery")}
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
                              {t("Min Charge For Long Distances")}
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
                              placeholder={t(
                                "Enter min Charge for Long Distance"
                              )}
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

                        <Col lg={12}>
                          <div className="mb-3 mt-3">
                            <div className="form-check form-switch">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="alwaysOpenToggle"
                                name="always_open"
                                checked={values.always_open}
                                onChange={(e) => {
                                  handleChange(e);
                                  if (e.target.checked) {
                                    setFieldValue("openingTime", "");
                                    setFieldValue("closingTime", "");
                                  }
                                }}
                                onBlur={handleBlur}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="alwaysOpenToggle"
                              >
                                {t("Always Open")}
                              </Label>
                            </div>
                            <ErrorMessage
                              name="always_open"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </Col>

                        {!values.always_open && (
                          <>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="openingtimeinput"
                                  className="form-label"
                                >
                                  {t("Opening Time")}
                                </Label>
                                <Flatpickr
                                  className={`form-control ${
                                    errors.openingTime && touched.openingTime
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  type="time"
                                  value={values.openingTime}
                                  onChange={(date) =>
                                    setFieldValue(
                                      "openingTime",
                                      date[0]
                                        ? date[0].toTimeString().slice(0, 8)
                                        : ""
                                    )
                                  }
                                  onBlur={() =>
                                    handleBlur({
                                      target: { name: "openingTime" },
                                    } as any)
                                  }
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i:s",
                                    time_24hr: true,
                                  }}
                                />
                                <ErrorMessage
                                  name="openingTime"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-6">
                                <Label
                                  htmlFor="closingtimeinput"
                                  className="form-label"
                                >
                                  {t("Closing Time")}
                                </Label>
                                <Flatpickr
                                  className={`form-control ${
                                    errors.closingTime && touched.closingTime
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  type="time"
                                  value={values.closingTime}
                                  onChange={(date) =>
                                    setFieldValue(
                                      "closingTime",
                                      date[0]
                                        ? date[0].toTimeString().slice(0, 8)
                                        : ""
                                    )
                                  }
                                  onBlur={() =>
                                    handleBlur({
                                      target: { name: "closingTime" },
                                    } as any)
                                  }
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i:s",
                                    time_24hr: true,
                                  }}
                                />
                                <ErrorMessage
                                  name="closingTime"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </>
                        )}

                        <Col lg={12}>
                          <div className="mb-3">
                            <Label htmlFor="regionInput" className="form-label">
                              {t("Region")}
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
                              <option value="">{t("Select Region")}</option>
                              {supportedRegions.map((region) => (
                                <option key={region.id} value={region.value}>
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
                              {t("Vendor Type")}
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
                              <option value="">
                                {t("Select Vendor Type")}
                              </option>
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

                        <VendorUploadFiles
                          files={files}
                          uploadedFiles={setFiles}
                          defaultValues={{
                            license: null,
                            identity: null,
                            profile: null,
                            cover: null,
                          }}
                        />

                        <VendorMap
                          selectedCoords={setSelectedCoords}
                          currentCoords={selectedCoords}
                        />

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={isSubmitting || isLoading}
                            >
                              {(isSubmitting || isLoading) && (
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              )}
                              {isSubmitting || isLoading
                                ? t("Submitting...")
                                : t("Add Vendor")}
                            </Button>
                            <Button
                              type="button"
                              color="light"
                              onClick={() => window.history.back()}
                            >
                              {t("Cancel")}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}
              </Formik>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorAdd;
