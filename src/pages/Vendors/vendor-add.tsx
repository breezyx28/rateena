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
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import VendorMap from "./vendor-map";
import VendorUploadFiles from "./vendor-upload-files";
import {
  supportedRegions,
  supportedVendorType,
} from "./validation/vendor-validation";
import { useTranslation } from "react-i18next";
import { useVendor } from "../../hooks/useVendor";
import { useFormik } from "formik";
import * as Yup from "yup";

const VendorAdd = () => {
  const { t } = useTranslation();
  document.title = "Add Vendor | Rateena - E-Shop Admin Panel";

  const navigate = useNavigate();
  const [files, setFiles] = React.useState<any>({
    licenseImageFile: null,
    identityImageFile: null,
    profileImageFile: null,
    coverImageFile: null,
  });
  const [selectedCoords, setSelectedCoords] = React.useState<any>(undefined);

  const {
    submit: submitVendor,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset: resetVendor,
  } = useVendor();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().min(2).max(50).required("English name is required"),
    arFullName: Yup.string().min(2).max(50).required("Arabic name is required"),
    userPhone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/)
      .min(8)
      .max(20)
      .required("Phone number is required"),
    userEmail: Yup.string().email().required("Email is required"),
    password: Yup.string().min(8).required("Password is required"),
    maxKilometerDelivery: Yup.number()
      .min(1)
      .max(1000)
      .required()
      .typeError("Must be a number"),
    minChargeLongDistance: Yup.number()
      .min(0)
      .max(10000)
      .required()
      .typeError("Must be a number"),
    always_open: Yup.boolean().required(),
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

  const formik = useFormik({
    initialValues: {
      fullName: "",
      arFullName: "",
      userPhone: "",
      userEmail: "",
      password: "",
      maxKilometerDelivery: "",
      minChargeLongDistance: "",
      always_open: false,
      openingTime: "",
      closingTime: "",
      region: "",
      vendorType: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const vendorPayload = {
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
        lat: selectedCoords?.lat,
        lng: selectedCoords?.lng,
      };

      try {
        await submitVendor({
          VendorPayload: vendorPayload,
          licenseImage: files.licenseImageFile,
          identityImage: files.identityImageFile,
          profileImage: files.profileImageFile,
          coverImage: files.coverImageFile,
        });
      } catch (err) {
        console.error("Vendor submission error:", err);
      }
    },
  });

  // Handle success
  React.useEffect(() => {
    if (isSuccess) {
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
        // formik.resetForm();
        // resetVendor();
        // setFiles({
        //   licenseImageFile: null,
        //   identityImageFile: null,
        //   profileImageFile: null,
        //   coverImageFile: null,
        // });
        // setSelectedCoords(undefined);
        if (result.isConfirmed) {
          navigate("/dashboard/vendors");
        }
      });
    }
  }, [isSuccess]);

  // Handle error
  React.useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: t("Error!"),
        text: error?.message || t("Failed to add vendor. Please try again."),
        confirmButtonText: t("OK"),
      });
    }
  }, [isError, error]);

  const handleSubmit = async () => {
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

      formik.handleSubmit();
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <Form
                id="vendor-info-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {formik.status?.serverError && (
                  <Alert color="danger">
                    {String(formik.status.serverError)}
                  </Alert>
                )}

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
                          formik.errors.fullName && formik.touched.fullName
                            ? "is-invalid"
                            : ""
                        }`}
                        id="englishfullnameInput"
                        placeholder={t("Enter English Full Name")}
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div className="invalid-feedback">
                          {String(formik.errors.fullName)}
                        </div>
                      )}
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
                          formik.errors.arFullName && formik.touched.arFullName
                            ? "is-invalid"
                            : ""
                        }`}
                        id="arabicfullnameInput"
                        placeholder={t("Enter Arabic Full Name")}
                        name="arFullName"
                        value={formik.values.arFullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.arFullName &&
                        formik.errors.arFullName && (
                          <div className="invalid-feedback">
                            {String(formik.errors.arFullName)}
                          </div>
                        )}
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
                          formik.errors.userPhone && formik.touched.userPhone
                            ? "is-invalid"
                            : ""
                        }`}
                        id="phonenumberInput"
                        placeholder={t("Enter your phone number")}
                        name="userPhone"
                        value={formik.values.userPhone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.userPhone && formik.errors.userPhone && (
                        <div className="invalid-feedback">
                          {String(formik.errors.userPhone)}
                        </div>
                      )}
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
                          formik.errors.userEmail && formik.touched.userEmail
                            ? "is-invalid"
                            : ""
                        }`}
                        id="emailInput"
                        placeholder={t("Enter your email")}
                        name="userEmail"
                        value={formik.values.userEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.userEmail && formik.errors.userEmail && (
                        <div className="invalid-feedback">
                          {String(formik.errors.userEmail)}
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="passwordinput" className="form-label">
                        {t("Password")}
                      </Label>
                      <Input
                        type="password"
                        className={`form-control ${
                          formik.errors.password && formik.touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                        id="passwordinput"
                        placeholder={t("Enter your password")}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">
                          {String(formik.errors.password)}
                        </div>
                      )}
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
                          formik.errors.maxKilometerDelivery &&
                          formik.touched.maxKilometerDelivery
                            ? "is-invalid"
                            : ""
                        }`}
                        id="maxkilometerdelivery"
                        name="maxKilometerDelivery"
                        placeholder={t("Enter max Kilometer Delivery")}
                        value={formik.values.maxKilometerDelivery}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.maxKilometerDelivery &&
                        formik.errors.maxKilometerDelivery && (
                          <div className="invalid-feedback">
                            {String(formik.errors.maxKilometerDelivery)}
                          </div>
                        )}
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
                          formik.errors.minChargeLongDistance &&
                          formik.touched.minChargeLongDistance
                            ? "is-invalid"
                            : ""
                        }`}
                        id="minchargeforlongdistance"
                        name="minChargeLongDistance"
                        placeholder={t("Enter min Charge for Long Distance")}
                        value={formik.values.minChargeLongDistance}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.minChargeLongDistance &&
                        formik.errors.minChargeLongDistance && (
                          <div className="invalid-feedback">
                            {String(formik.errors.minChargeLongDistance)}
                          </div>
                        )}
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
                          checked={formik.values.always_open}
                          onChange={(e) => {
                            formik.handleChange(e);
                            if (e.target.checked) {
                              formik.setFieldValue("openingTime", "");
                              formik.setFieldValue("closingTime", "");
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="alwaysOpenToggle"
                        >
                          {t("Always Open")}
                        </Label>
                      </div>
                      {formik.touched.always_open &&
                        formik.errors.always_open && (
                          <div className="invalid-feedback">
                            {String(formik.errors.always_open)}
                          </div>
                        )}
                    </div>
                  </Col>

                  {!formik.values.always_open && (
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
                              formik.errors.openingTime &&
                              formik.touched.openingTime
                                ? "is-invalid"
                                : ""
                            }`}
                            type="time"
                            value={formik.values.openingTime}
                            onChange={(date) =>
                              formik.setFieldValue(
                                "openingTime",
                                date[0]
                                  ? date[0].toTimeString().slice(0, 8)
                                  : ""
                              )
                            }
                            onBlur={() =>
                              formik.handleBlur({
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
                          {formik.touched.openingTime &&
                            formik.errors.openingTime && (
                              <div className="invalid-feedback">
                                {String(formik.errors.openingTime)}
                              </div>
                            )}
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
                              formik.errors.closingTime &&
                              formik.touched.closingTime
                                ? "is-invalid"
                                : ""
                            }`}
                            type="time"
                            value={formik.values.closingTime}
                            onChange={(date) =>
                              formik.setFieldValue(
                                "closingTime",
                                date[0]
                                  ? date[0].toTimeString().slice(0, 8)
                                  : ""
                              )
                            }
                            onBlur={() =>
                              formik.handleBlur({
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
                          {formik.touched.closingTime &&
                            formik.errors.closingTime && (
                              <div className="invalid-feedback">
                                {String(formik.errors.closingTime)}
                              </div>
                            )}
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
                          formik.errors.region && formik.touched.region
                            ? "is-invalid"
                            : ""
                        }`}
                        name="region"
                        value={formik.values.region}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">{t("Select Region")}</option>
                        {supportedRegions.map((region) => (
                          <option key={region.id} value={region.value}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.region && formik.errors.region && (
                        <div className="invalid-feedback">
                          {String(formik.errors.region)}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="vendorTypeInput" className="form-label">
                        {t("Vendor Type")}
                      </Label>
                      <select
                        className={`form-select ${
                          formik.errors.vendorType && formik.touched.vendorType
                            ? "is-invalid"
                            : ""
                        }`}
                        name="vendorType"
                        value={formik.values.vendorType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">{t("Select Vendor Type")}</option>
                        {supportedVendorType.map((type) => (
                          <option key={type.id} value={type.value}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.vendorType &&
                        formik.errors.vendorType && (
                          <div className="invalid-feedback">
                            {String(formik.errors.vendorType)}
                          </div>
                        )}
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
                    errors={formik.errors}
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
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        {isLoading ? t("Submitting...") : t("Add Vendor")}
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
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorAdd;
