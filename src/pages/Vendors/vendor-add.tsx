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
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import { addVendorMutation } from "slices/thunks";
import { clearVendorError } from "slices/vendors/reducer";
import { toast, ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import VendorMap from "./vendor-map";
import VendorUploadFiles from "./vendor-upload-files";
import {
  formatErrorMessage,
  logError,
  errorToastManager,
} from "helpers/error-helper";

const VendorAdd = () => {
  document.title = "Vendor Add | Rateena - E-Shop Admin Panel";

  const dispatch: any = useDispatch();

  // Mock data - replace with actual data from props or state
  const supportedRegions = [
    { id: 1, value: "DUBAI", name: "Dubai" },
    { id: 2, value: "ABU_DHABI", name: "Abu Dhabi" },
    { id: 3, value: "SHARJAH", name: "Sharjah" },
  ];

  const supportedVendorType = [
    { id: 1, value: "GROCERY", name: "Grocery" },
    { id: 2, value: "RESTAURANT", name: "Restaurant" },
    { id: 3, value: "PHARMACY", name: "Pharmacy" },
  ];
  const [files, setFiles] = React.useState({
    licenseImageFile: null,
    identityImageFile: null,
  });
  const [selectedCoords, setSelectedCoords] = React.useState<any>(null);

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    addVendorSuccess: state.addVendorSuccess,
    addVendorError: state.addVendorError,
    isLoading: state.isLoading,
  }));

  const { addVendorSuccess, addVendorError, isLoading } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (addVendorSuccess) {
      toast.success("Vendor added successfully");
      validation.resetForm();
      setFiles({ identityImageFile: null, licenseImageFile: null });
      setSelectedCoords(null);
      // Clear any previous errors
      dispatch(clearVendorError());
      errorToastManager.clearLastError();
    }
    if (addVendorError) {
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(addVendorError, toast.error);
      logError(addVendorError, "Vendor Add");
    }
  }, [addVendorSuccess, addVendorError, dispatch]);

  // Cleanup effect to clear errors when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearVendorError());
      errorToastManager.clearLastError();
    };
  }, [dispatch]);

  // Formik + Yup (preserve existing inputs; only wire validation/submit)
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      arFullName: "",
      userPhone: "",
      userEmail: "",
      maxKilometerDelivery: "",
      minChargeLongDistance: "",
      openingTime: "",
      closingTime: "",
      region: "",
      vendorType: "",
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required("English name is required"),
      arFullName: Yup.string().required("Arabic name is required"),
      userPhone: Yup.string().required("Phone number is required"),
      userEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      maxKilometerDelivery: Yup.number()
        .typeError("Must be a number")
        .required("Max kilometer is required")
        .min(0, "Must be >= 0"),
      minChargeLongDistance: Yup.number()
        .typeError("Must be a number")
        .required("Min charge is required")
        .min(0, "Must be >= 0"),
      openingTime: Yup.string().required("Opening time is required"),
      closingTime: Yup.string().required("Closing time is required"),
      region: Yup.string().required("Region is required"),
      vendorType: Yup.string().required("Vendor type is required"),
    }),
    onSubmit: (values) => {
      // Clear any previous errors before submitting
      dispatch(clearVendorError());
      errorToastManager.clearLastError();

      const payload = {
        VendorPayload: {
          ...values,
          lat: selectedCoords?.lat,
          lng: selectedCoords?.lng,
        },
        licenseImage: files.licenseImageFile,
        identityImage: files.identityImageFile,
      };

      const formData = new FormData();

      formData.append("VendorPayload", payload.VendorPayload.toString());
      formData.append("licenseImage", payload.licenseImage as any);
      formData.append("identityImage", payload.identityImage as any);

      dispatch(addVendorMutation(formData));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
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
                        className="form-control"
                        id="englishfullnameInput"
                        placeholder="Enter English Full Name"
                        value={validation.values.fullName}
                        name="fullName"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.fullName &&
                          !!validation.errors.fullName
                        }
                      />
                      {validation.touched.fullName &&
                      validation.errors.fullName ? (
                        <FormFeedback>
                          {validation.errors.fullName}
                        </FormFeedback>
                      ) : null}
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
                        className="form-control"
                        id="arabicfullnameInput"
                        placeholder="Enter Arabic Full Name"
                        value={validation.values.arFullName}
                        name="arFullName"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.arFullName &&
                          !!validation.errors.arFullName
                        }
                      />
                      {validation.touched.arFullName &&
                      validation.errors.arFullName ? (
                        <FormFeedback>
                          {validation.errors.arFullName}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="phonenumberInput" className="form-label">
                        Phone Number
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="phonenumberInput"
                        placeholder="Enter your phone number"
                        value={validation.values.userPhone}
                        name="userPhone"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.userPhone &&
                          !!validation.errors.userPhone
                        }
                      />
                      {validation.touched.userPhone &&
                      validation.errors.userPhone ? (
                        <FormFeedback>
                          {validation.errors.userPhone}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="emailInput" className="form-label">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        placeholder="Enter your email"
                        value={validation.values.userEmail}
                        name="userEmail"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.userEmail &&
                          !!validation.errors.userEmail
                        }
                      />
                      {validation.touched.userEmail &&
                      validation.errors.userEmail ? (
                        <FormFeedback>
                          {validation.errors.userEmail}
                        </FormFeedback>
                      ) : null}
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
                        className="form-control"
                        id="maxkilometerdelivery"
                        name={"maxKilometerDelivery"}
                        placeholder="Enter max Kilometer Delivery"
                        value={validation.values.maxKilometerDelivery}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.maxKilometerDelivery &&
                          !!validation.errors.maxKilometerDelivery
                        }
                      />
                      {validation.touched.maxKilometerDelivery &&
                      validation.errors.maxKilometerDelivery ? (
                        <FormFeedback>
                          {validation.errors.maxKilometerDelivery as any}
                        </FormFeedback>
                      ) : null}
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
                        className="form-control"
                        id="minchargeforlongdistance"
                        name={"minChargeLongDistance"}
                        placeholder="Enter min Charge for Long Distance"
                        value={validation.values.minChargeLongDistance}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.minChargeLongDistance &&
                          !!validation.errors.minChargeLongDistance
                        }
                      />
                      {validation.touched.minChargeLongDistance &&
                      validation.errors.minChargeLongDistance ? (
                        <FormFeedback>
                          {validation.errors.minChargeLongDistance as any}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="openingtimeinput" className="form-label">
                        Opening Time
                      </Label>
                      <Flatpickr
                        className="form-control"
                        type="time"
                        options={{
                          enableTime: true, // enable time
                          noCalendar: true, // hide calendar
                          dateFormat: "H:i:S", // hours:minutes:seconds
                          time_24hr: true, // 24-hour format
                        }}
                        onChange={(dates: any, str: string) =>
                          validation.setFieldValue("openingTime", str)
                        }
                      />
                      {validation.touched.openingTime &&
                      validation.errors.openingTime ? (
                        <div className="text-danger small mt-1">
                          {validation.errors.openingTime}
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label htmlFor="closingtimeinput" className="form-label">
                        Closing Time
                      </Label>
                      <Flatpickr
                        className="form-control"
                        options={{
                          enableTime: true, // enable time
                          noCalendar: true, // hide calendar
                          dateFormat: "H:i:S", // hours:minutes:seconds
                          time_24hr: true, // 24-hour format
                        }}
                        onChange={(dates: any, str: string) =>
                          validation.setFieldValue("closingTime", str)
                        }
                      />
                      {validation.touched.closingTime &&
                      validation.errors.closingTime ? (
                        <div className="text-danger small mt-1">
                          {validation.errors.closingTime}
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="regionInput" className="form-label">
                        Region
                      </Label>
                      <select
                        className="form-select mb-3"
                        name={"region"}
                        value={validation.values.region}
                        onChange={(e) =>
                          validation.setFieldValue("region", e.target.value)
                        }
                        onBlur={() =>
                          validation.setFieldTouched("region", true)
                        }
                        aria-invalid={
                          validation.touched.region &&
                          !!validation.errors.region
                        }
                      >
                        <option>Region </option>
                        {supportedRegions.map((region) => {
                          return (
                            <option key={region.id} value={region.value}>
                              {region.name}
                            </option>
                          );
                        })}
                      </select>
                      {validation.touched.region && validation.errors.region ? (
                        <div className="text-danger small mt-1">
                          {validation.errors.region}
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="vendorTypeInput" className="form-label">
                        Vendor Type
                      </Label>
                      <select
                        className="form-select mb-3"
                        name={"vendorType"}
                        value={validation.values.vendorType}
                        onChange={(e) =>
                          validation.setFieldValue("vendorType", e.target.value)
                        }
                        onBlur={() =>
                          validation.setFieldTouched("vendorType", true)
                        }
                        aria-invalid={
                          validation.touched.vendorType &&
                          !!validation.errors.vendorType
                        }
                      >
                        <option>Vendor Type</option>
                        {supportedVendorType.map((type) => {
                          return (
                            <option key={type.id} value={type.value}>
                              {type.name}
                            </option>
                          );
                        })}
                      </select>
                      {validation.touched.vendorType &&
                      validation.errors.vendorType ? (
                        <div className="text-danger small mt-1">
                          {validation.errors.vendorType}
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  {/* files upload should be here */}
                  <VendorUploadFiles
                    files={{ licenseImageFile: null, identityImageFile: null }}
                    uploadedFiles={setFiles}
                    defaultValues={{ license: null, identity: null }}
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
                        {isLoading ? "Adding..." : "Add Vendor"}
                      </Button>
                      <Button
                        type="button"
                        color="light"
                        onClick={() => validation.resetForm()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
      <ToastContainer autoClose={2000} limit={1} />
    </React.Fragment>
  );
};

export default VendorAdd;
