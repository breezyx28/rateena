import React, { useState } from "react";
import { Col, Form, Input, Label, Row } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { Formik, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { addVendorMutation } from "slices/thunks";
import { mapServerErrorsToFormik } from "../../../helpers/error-helper";
import VendorUploadFiles from "../vendor-upload-files";
import VendorMap from "../vendor-map";
import {
  supportedRegions,
  supportedVendorType,
} from "../validation/vendor-validation";
import { useVendorState } from "hooks";

interface PersonalDetailsTabProps {
  vendorInfo: any;
  vendorId: string;
  selectedCoords: { lat: number; lng: number } | undefined;
  setSelectedCoords: (coords: { lat: number; lng: number } | undefined) => void;
}

const PersonalDetailsTab: React.FC<PersonalDetailsTabProps> = ({
  vendorInfo,
  vendorId,
  selectedCoords,
  setSelectedCoords,
}) => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();
  const [files, setFiles] = useState({
    licenseImageFile: null,
    identityImageFile: null,
    profileImageFile: null,
    coverImageFile: null,
  });

  const { vendorUpdatedSuccess, vendorError } = useVendorState({
    vendorId: vendorId || "",
    initialVendorInfo: {},
  });

  // Helper to format time to H:i:s
  const formatTimeToHis = (time: string) => {
    if (!time) return "";
    if (time.includes("T")) {
      return new Date(time).toTimeString().slice(0, 8);
    }
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) return time;
    if (time.match(/^\d{2}:\d{2}$/)) return `${time}:00`;
    return time;
  };

  // Initial values for vendor info form
  const getInitialValues = () => ({
    fullName: vendorInfo?.fullName || "",
    arFullName: vendorInfo?.arFullName || "",
    userPhone: vendorInfo?.userPhone || "",
    userEmail: vendorInfo?.userEmail || "",
    maxKilometerDelivery: vendorInfo?.maxKilometerDelivery || "",
    minChargeLongDistance: vendorInfo?.minChargeLongDistance || "",
    openingTime: formatTimeToHis(vendorInfo?.openingTime || ""),
    closingTime: formatTimeToHis(vendorInfo?.closingTime || ""),
    region: vendorInfo?.region || "",
    vendorType: vendorInfo?.vendorType || "",
    always_open: vendorInfo?.always_open || false, // Add always_open field
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
      .min(1, "Max kilometer delivery must be at least 1")
      .max(1000, "Max kilometer delivery must be less than 1000")
      .required("Max kilometer delivery is required")
      .typeError("Max kilometer delivery must be a number"),
    minChargeLongDistance: Yup.number()
      .min(0, "Min charge for long distance must be at least 0")
      .max(10000, "Min charge for long distance must be less than 10000")
      .required("Min charge for long distance is required")
      .typeError("Min charge for long distance must be a number"),
    always_open: Yup.boolean(),
    openingTime: Yup.string(),
    closingTime: Yup.string(),
    region: Yup.string().required("Region is required"),
    vendorType: Yup.string().required("Vendor type is required"),
  });

  // Handle vendor info form submission with Formik
  const handleVendorInfoSubmit = (values: any, { setSubmitting }: any) => {
    const formData = new FormData();

    // Create VendorPayload object with correct field mapping
    const vendorPayload: any = {
      vendorId: vendorId ?? null,
      userId: vendorInfo?.userId ?? null,
      fullName: values.fullName,
      arFullName: values.arFullName,
      phone: values.userPhone, // Map userPhone to phone
      email: values.userEmail, // Map userEmail to email
      maxKilometerDelivery: parseInt(values.maxKilometerDelivery),
      openingTime: values.openingTime, // Map fOpeningTime to openingTime
      closingTime: values.closingTime, // Map fClosingTime to closingTime
      always_open: values.always_open || false, // Map fClosingTime to closingTime
      region: values.region,
      vendorType: values.vendorType,
      minChargeLongDistance: parseInt(values.minChargeLongDistance),
    };

    // Add coordinates if selected
    if (
      selectedCoords &&
      typeof selectedCoords === "object" &&
      "lat" in selectedCoords &&
      "lng" in selectedCoords
    ) {
      vendorPayload.lat = selectedCoords.lat;
      vendorPayload.lng = selectedCoords.lng;
    }

    // Add VendorPayload as JSON string
    formData.append("VendorPayload", JSON.stringify(vendorPayload));

    // Add files if uploaded
    if (files.licenseImageFile) {
      formData.append("licenseImage", files.licenseImageFile);
    }
    if (files.identityImageFile) {
      formData.append("identityImage", files.identityImageFile);
    }
    if (files.profileImageFile) {
      formData.append("profileImage", files.profileImageFile);
    }
    if (files.coverImageFile) {
      formData.append("coverImage", files.coverImageFile);
    }

    dispatch(addVendorMutation(formData));
    setSubmitting(false);
  };

  // Component to handle server errors using useFormikContext
  const ServerErrorHandler = () => {
    const { setErrors } = useFormikContext<any>();

    React.useEffect(() => {
      if (vendorError?.message || vendorError?.errors) {
        const fieldMapping = {
          identityImage: "identityImageFile",
          licenseImage: "licenseImageFile",
          profileImage: "profileImageFile",
          coverImage: "coverImageFile",
        };
        mapServerErrorsToFormik(vendorError, setErrors, fieldMapping);
        toast.error("Failed to update vendor information. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }, [vendorError, setErrors]);

    React.useEffect(() => {
      if (vendorUpdatedSuccess) {
        toast.success("Vendor information updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }, [vendorUpdatedSuccess]);

    return null;
  };

  return (
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
          <ServerErrorHandler />
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="englishfullnameInput" className="form-label">
                  {t("English Name")}
                </Label>
                <Input
                  type="text"
                  className={`form-control ${
                    errors.fullName && touched.fullName ? "is-invalid" : ""
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
                <Label htmlFor="arabicfullnameInput" className="form-label">
                  {t("Arabic Name")}
                </Label>
                <Input
                  type="text"
                  className={`form-control ${
                    errors.arFullName && touched.arFullName ? "is-invalid" : ""
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
                <Label htmlFor="phonenumberInput" className="form-label">
                  {t("Phone Number")}
                </Label>
                <Input
                  type="text"
                  className={`form-control ${
                    errors.userPhone && touched.userPhone ? "is-invalid" : ""
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
                    errors.userEmail && touched.userEmail ? "is-invalid" : ""
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

            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="maxkilometerdelivery" className="form-label">
                  {t("Max Kilometer Delivery")}
                </Label>
                <Input
                  type="number"
                  className={`form-control ${
                    errors.maxKilometerDelivery && touched.maxKilometerDelivery
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
                  placeholder={t("Enter min Charge for Long Distance")}
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
              <div className="mb-3">
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
                    <Label htmlFor="openingtimeinput" className="form-label">
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
                          date[0] ? date[0].toTimeString().slice(0, 8) : ""
                        )
                      }
                      onBlur={() =>
                        handleBlur({
                          target: { name: "openingTime" },
                        })
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
                  <div className="mb-3">
                    <Label htmlFor="closingtimeinput" className="form-label">
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
                          date[0] ? date[0].toTimeString().slice(0, 8) : ""
                        )
                      }
                      onBlur={() =>
                        handleBlur({
                          target: { name: "closingTime" },
                        })
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
                    errors.region && touched.region ? "is-invalid" : ""
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
                <Label htmlFor="vendorTypeInput" className="form-label">
                  {t("Vendor Type")}
                </Label>
                <select
                  className={`form-select ${
                    errors.vendorType && touched.vendorType ? "is-invalid" : ""
                  }`}
                  name="vendorType"
                  value={values.vendorType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">{t("Select Vendor Type")}</option>
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
                profile: vendorInfo?.profileImage ?? null,
                cover: vendorInfo?.coverImage ?? null,
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
                  {isSubmitting ? t("Updating...") : t("Update Vendor Info")}
                </button>
                <button type="button" className="btn btn-soft-success">
                  {t("Cancel")}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalDetailsTab;
