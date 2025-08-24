import React, { useState } from "react";
import { Col, Form, Input, Label, Row } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { addVendorMutation } from "slices/thunks";
import VendorUploadFiles from "../vendor-upload-files";
import VendorMap from "../vendor-map";
import {
  supportedRegions,
  supportedVendorType,
} from "../validation/vendor-validation";
import { useVendorContext } from "../../../contexts/VendorContext";
import { mapServerErrorsToFormik } from "../../../helpers/error-helper";

// This component shows how to use the context approach
const PersonalDetailsTabWithContext: React.FC = () => {
  const {
    vendorInfo,
    selectedCoords,
    setSelectedCoords,
    dispatch,
    vendorError,
  } = useVendorContext();

  const [files, setFiles] = useState({
    licenseImageFile: null,
    identityImageFile: null,
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
      .min(1, "Max kilometer delivery must be at least 1")
      .max(1000, "Max kilometer delivery must be less than 1000")
      .required("Max kilometer delivery is required")
      .typeError("Max kilometer delivery must be a number"),
    minChargeLongDistance: Yup.number()
      .min(0, "Min charge for long distance must be at least 0")
      .max(10000, "Min charge for long distance must be less than 10000")
      .required("Min charge for long distance is required")
      .typeError("Min charge for long distance must be a number"),
    fOpeningTime: Yup.string().required("Opening time is required"),
    fClosingTime: Yup.string().required("Closing time is required"),
    region: Yup.string().required("Region is required"),
    vendorType: Yup.string().required("Vendor type is required"),
  });

  React.useEffect(() => {
    if (vendorError) {
      console.log("vendorError: ", vendorError);
    }
  }, [vendorError]);



  // Handle vendor info form submission with Formik
  const handleVendorInfoSubmit = (
    values: any,
    { setSubmitting, resetForm, setErrors }: any
  ) => {
    try {
      const formData = new FormData();
      formData.append("vendorId", vendorInfo?.id || "");

      // Create VendorPayload object with correct field mapping
      const vendorPayload: any = {
        fullName: values.fullName,
        arFullName: values.arFullName,
        phone: values.userPhone, // Map userPhone to phone
        email: values.userEmail, // Map userEmail to email
        maxKilometerDelivery: parseInt(values.maxKilometerDelivery),
        openingTime: values.fOpeningTime, // Map fOpeningTime to openingTime
        closingTime: values.fClosingTime, // Map fClosingTime to closingTime
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

      dispatch(addVendorMutation(formData))
        .unwrap()
        .then(() => {
          toast.success("Vendor information updated successfully!", {
            position: "top-right",
            autoClose: 2000,
          });
          setSubmitting(false);
        })
        .catch((error: any) => {
          const fieldMapping = {
            identityImage: 'identityImageFile',
            licenseImage: 'licenseImageFile'
          };
          mapServerErrorsToFormik(error, setErrors, fieldMapping);
          setSubmitting(false);
        });
    } catch (error) {
      console.error("Error submitting vendor form:", error);
      toast.error("Failed to update vendor information. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitting(false);
    }
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
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="englishfullnameInput" className="form-label">
                  English Name
                </Label>
                <Input
                  type="text"
                  className={`form-control ${
                    errors.fullName && touched.fullName ? "is-invalid" : ""
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
            {/* Add other form fields here... */}
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Vendor Info"}
                </button>
                <button type="button" className="btn btn-soft-success">
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalDetailsTabWithContext;
