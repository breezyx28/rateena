import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Button, Modal, ModalBody, ModalHeader, Alert } from "reactstrap";
import { AdvertisementsList } from "./AdvertisementsList";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateAdvertisementMutation,
  getAdvertisementsListQuery,
} from "slices/advertisements/thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
// Removed FilePond in favor of simple input uploader like add-product-modal
import { vendorsList } from "slices/thunks";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const Advertisements = () => {
  document.title = "Advertisements | Rateena - E-Shop Admin Panel";

  const { i18n, t } = useTranslation();
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      addForm.setFieldValue("adsImage1", files.length > 0 ? files[0] : "");
    }
  };

  const removeSelectedFile = () => {
    setSelectedFiles([]);
    addForm.setFieldValue("adsImage1", "");
  };

  const dispatch: any = useDispatch();

  // Helper function to convert time format from "HH:mm:ss AM/PM" to "HH:mm"
  const convertTimeFormat = (timeString: string) => {
    if (!timeString) return "";

    // If already in HH:mm format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Convert from "HH:mm:ss AM/PM" to "HH:mm"
    try {
      const [time, period] = timeString.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);

      if (period === "PM" && hour !== 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }

      return `${hour.toString().padStart(2, "0")}:${minutes}`;
    } catch (error) {
      console.error("Error converting time format:", error);
      return "";
    }
  };

  const selectLayoutState = (state: any) => state.Advertisements;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    success: state.success,
    error: state.error,
    advertisementUpdatedSuccess: state.advertisementUpdatedSuccess,
    advertisementsListSuccess: state.advertisementsListSuccess,
    advertisementError: state.advertisementError,
  }));
  // Inside your component
  const {
    advertisementsListSuccess,
    advertisementError,
    advertisementUpdatedSuccess,
  } = useSelector(selectLayoutProperties);
  // Vendor Reducer
  const selectVendorsLayoutState = (state: any) => state.Vendors;
  const selectVendorLayoutProperties = createSelector(
    selectVendorsLayoutState,
    (state) => ({
      vendorsListSuccess: state.vendorsListSuccess,
      vendorsError: state.vendorsError,
    })
  );

  // Inside your component
  const { vendorsError, vendorsListSuccess } = useSelector(
    selectVendorLayoutProperties
  );

  // Create vendor options for react-select
  const vendorOptions = useMemo(() => {
    if (!vendorsListSuccess?.list) return [];

    return vendorsListSuccess.list.map((vendor: any) => ({
      value: vendor.vendorId,
      label: i18n.dir() === "rtl" ? vendor.arFullName : vendor.fullName,
    }));
  }, [vendorsListSuccess, i18n]);

  React.useEffect(() => {
    dispatch(getAdvertisementsListQuery());
    dispatch(vendorsList());
  }, []);

  React.useEffect(() => {
    if (advertisementsListSuccess) {
      console.log("advertisementsListSuccess: ", advertisementsListSuccess);
    }
    if (advertisementUpdatedSuccess) {
      console.log("advertisementUpdatedSuccess: ", advertisementUpdatedSuccess);
    }
    if (vendorsListSuccess) {
      console.log("vendorsListSuccess: ", vendorsListSuccess);
    }
    if (advertisementError) {
      console.log("advertisementError: ", advertisementError);
    }
  }, [
    advertisementError,
    advertisementsListSuccess,
    vendorsListSuccess,
    advertisementUpdatedSuccess,
  ]);

  // Show success toast when advertisement is updated successfully
  React.useEffect(() => {
    if (advertisementUpdatedSuccess && !advertisementError) {
      toast.success(t("Advertisement added successfully"));
      setmodal_standard(false);
      addForm.resetForm();
      setSelectedFiles([]);
      setIsSubmitting(false);
    }
  }, [advertisementUpdatedSuccess, advertisementError]);

  // Handle loading state when error occurs
  React.useEffect(() => {
    if (advertisementError) {
      setIsSubmitting(false);
    }
  }, [advertisementError]);

  // Normalize time to HH:mm:ss
  const normalizeTimeToHms = (timeString: string) => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) return timeString;
    if (/^\d{2}:\d{2}$/.test(timeString)) return `${timeString}:00`;
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    } catch {
      return timeString;
    }
  };

  // Map server validation errors into Formik status/field errors
  React.useEffect(() => {
    if (!advertisementError) return;
    const serverMessage = advertisementError?.message;
    const serverErrors = advertisementError?.errors || {};
    addForm.setStatus({ serverError: serverMessage });
    if (serverErrors && typeof serverErrors === "object") {
      Object.entries(serverErrors).forEach(([key, value]) => {
        const firstMessage = Array.isArray(value)
          ? String(value[0])
          : String(value);
        // Only map to known fields; otherwise keep it as server status
        if (key in addForm.values) {
          addForm.setFieldError(key as any, firstMessage);
        }
      });
    }
  }, [advertisementError]);

  const addForm = useFormik({
    enableReinitialize: false,
    initialValues: {
      title: "",
      arTitle: "",
      subtitle: "",
      arSubtitle: "",
      startDate: "",
      expireDate: "",
      startTime: "",
      endTime: "",
      url: "",
      banner: "",
      priority: "",
      vendorId: "",
      replacePriority: false,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("English title is required"),
      arTitle: Yup.string().required("Arabic title is required"),
      subtitle: Yup.string().required("English subtitle is required"),
      arSubtitle: Yup.string().required("Arabic subtitle is required"),
      startDate: Yup.date().required("Start date is required"),
      expireDate: Yup.date().required("End date is required"),
      startTime: Yup.string().required("Start time is required"),
      endTime: Yup.string().required("End time is required"),
      // URL optional always; allow empty string by transforming to undefined
      url: Yup.string()
        .transform((value, originalValue) =>
          originalValue === "" ? undefined : value
        )
        .url("Must be a valid URL")
        .notRequired()
        .nullable(),
      vendorId: Yup.string().when("banner", {
        is: (val: string) => val !== "External Advertisements",
        then: (schema) => schema.required("Vendor is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      // clear any previous server error
      addForm.setStatus(undefined);
      setIsSubmitting(true);

      const normalizedValues = {
        ...values,
        // Null vendorId when external advertisement type is selected
        vendorId:
          values.banner === "External Advertisements" ? null : values.vendorId,
        startTime: normalizeTimeToHms(values.startTime as any),
        endTime: normalizeTimeToHms(values.endTime as any),
      } as typeof values;
      const payload = {
        AdvertisementPayload: normalizedValues,
        adsImage1:
          selectedFiles && selectedFiles.length > 0 ? selectedFiles[0] : null,
      };

      const formData = new FormData();
      formData.append(
        "AdvertisementPayload",
        JSON.stringify(payload.AdvertisementPayload)
      );

      if (payload.adsImage1) {
        formData.append("adsImage1", payload.adsImage1);
      }

      dispatch(addOrUpdateAdvertisementMutation(formData));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <div className="live-preview w-full d-flex justify-content-end">
                  <div>
                    <Button color="primary" onClick={() => tog_standard()}>
                      {t("Add Advertisement")}
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardHeader className="p-0 border-0 bg-light-subtle">
                    <Row className="g-0 text-center">
                      {advertisementsListSuccess &&
                        Object.keys(
                          advertisementsListSuccess?.availableBanners
                        ).map((key) => (
                          <Col xs={6} sm={3}>
                            <div className="p-3">
                              <h5 className="mb-1">
                                <span className={""}>{Number(key) + 1}</span>
                              </h5>
                              <p className="text-muted mb-0">
                                {advertisementsListSuccess?.availableBanners[
                                  key
                                ] ?? "---"}
                              </p>
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </CardHeader>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <AdvertisementsList
                        data={advertisementsListSuccess?.list ?? []}
                        vendorsListSuccess={vendorsListSuccess}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* Default Modal */}
        <Modal
          id="myModal"
          isOpen={modal_standard}
          toggle={() => {
            tog_standard();
          }}
          size="lg"
          fullscreen={true}
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={() => {
              tog_standard();
            }}
          >
            {t("Add Advertisement")}
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addForm.handleSubmit();
                return false;
              }}
            >
              {addForm.status?.serverError && !advertisementsListSuccess && (
                <>
                  {toast(t("Error adding advertisement"), {
                    position: "top-right",
                    hideProgressBar: false,
                    className: "bg-danger text-white",
                    progress: undefined,
                    toastId: "advertisement-error",
                  })}
                  <ToastContainer autoClose={2000} limit={1} />
                  <Alert color="danger">
                    {String(addForm.status.serverError)}
                  </Alert>
                </>
              )}
              <Row className="gy-4">
                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="title" className="form-label">
                      {t("English Title")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.title}
                      invalid={
                        addForm.touched.title && addForm.errors.title
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="arTitle" className="form-label">
                      {t("Arabic Title")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="arTitle"
                      name="arTitle"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.arTitle}
                      invalid={
                        addForm.touched.arTitle && addForm.errors.arTitle
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="subtitle" className="form-label">
                      {t("English Subtitle")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="subtitle"
                      name="subtitle"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.subtitle}
                      invalid={
                        addForm.touched.subtitle && addForm.errors.subtitle
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="arSubtitle" className="form-label">
                      {t("Arabic Subtitle")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="arSubtitle"
                      name="arSubtitle"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.arSubtitle}
                      invalid={
                        addForm.touched.arSubtitle && addForm.errors.arSubtitle
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="startDate" className="form-label">
                      {t("Start Date")}
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.startDate}
                      invalid={
                        addForm.touched.startDate && addForm.errors.startDate
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="expireDate" className="form-label">
                      {t("End Date")}
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="expireDate"
                      name="expireDate"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.expireDate}
                      invalid={
                        addForm.touched.expireDate && addForm.errors.expireDate
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="startTime" className="form-label">
                      {t("Start Time")}
                    </Label>
                    <Input
                      type="time"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.startTime}
                      invalid={
                        addForm.touched.startTime && addForm.errors.startTime
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="endTime" className="form-label">
                      {t("End Time")}
                    </Label>
                    <Input
                      type="time"
                      className="form-control"
                      id="endTime"
                      name="endTime"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.endTime}
                      invalid={
                        addForm.touched.endTime && addForm.errors.endTime
                          ? true
                          : false
                      }
                    />
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="url" className="form-label">
                      {t("Redirect URL")}
                    </Label>
                    <Input
                      type="url"
                      className="form-control"
                      id="url"
                      name="url"
                      placeholder="https://example.com"
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                      value={addForm.values.url}
                      invalid={
                        addForm.touched.url && addForm.errors.url ? true : false
                      }
                    />
                  </div>
                </Col>

                {/* Image Upload (aligned with add-product-modal.tsx) */}
                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="adsImage1" className="form-label">
                      {t("Advertisement Image")}
                    </Label>
                    <Input
                      type="file"
                      id="adsImage1"
                      name="adsImage1"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="mt-3">
                        <Label className="form-label text-muted">
                          {t("Selected Image:")}
                        </Label>
                        <div className="d-flex gap-2 flex-wrap">
                          <div className="position-relative">
                            <img
                              src={URL.createObjectURL(selectedFiles[0])}
                              alt="Selected"
                              className="rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              style={{ transform: "translate(50%, -50%)" }}
                              onClick={removeSelectedFile}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>

                {/* Advertisement Type Select */}
                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="banner" className="form-label">
                      {t("Advertisement Type")}
                    </Label>
                    <Input
                      type="select"
                      id="banner"
                      name="banner"
                      className="form-select"
                      value={addForm.values.banner}
                      onChange={(e) => {
                        addForm.handleChange(e);
                        const newVal = e.target.value;
                        if (newVal === "External Advertisements") {
                          // clear and null vendorId on external type
                          addForm.setFieldValue("vendorId", "");
                        }
                      }}
                      onBlur={addForm.handleBlur}
                    >
                      <option value="">{t("Select advertisement type")}</option>
                      <option value="External Advertisements">
                        {t("External Advertisements")}
                      </option>
                      <option value="Resturants">{t("Resturants")}</option>
                      <option value="Grocery">{t("Grocery")}</option>
                      <option value="Stores">{t("Stores")}</option>
                    </Input>
                  </div>
                </Col>

                {/* Vendor Selection */}
                {addForm.values.banner !== "External Advertisements" && (
                  <Col xxl={4} md={4}>
                    <div>
                      <Label htmlFor="vendorId" className="form-label">
                        {t("Vendor")}
                      </Label>
                      <Select
                        id="vendorId"
                        name="vendorId"
                        options={vendorOptions}
                        value={vendorOptions.find(
                          (option: any) =>
                            option.value === addForm.values.vendorId
                        )}
                        onChange={(selectedOption: any) => {
                          addForm.setFieldValue(
                            "vendorId",
                            selectedOption?.value || ""
                          );
                        }}
                        onBlur={() => addForm.setFieldTouched("vendorId", true)}
                        placeholder={t("Select vendor")}
                        isClearable
                        isSearchable
                        className={
                          addForm.touched.vendorId && addForm.errors.vendorId
                            ? "is-invalid"
                            : ""
                        }
                      />
                      {addForm.touched.vendorId && addForm.errors.vendorId && (
                        <div className="invalid-feedback d-block">
                          {String(addForm.errors.vendorId)}
                        </div>
                      )}
                    </div>
                  </Col>
                )}

                {/* Priority Select */}
                <Col xxl={4} md={4} sm={6}>
                  <div>
                    <Label htmlFor="priority" className="form-label">
                      {t("Priority")}
                    </Label>
                    <Input
                      type="select"
                      id="priority"
                      name="priority"
                      className="form-select"
                      value={addForm.values.priority}
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                    >
                      <option value="">{t("Select priority")}</option>
                      <option value={1}>{t("advertisement 1")}</option>
                      <option value={2}>{t("advertisement 2")}</option>
                      <option value={3}>{t("advertisement 3")}</option>
                      <option value={4}>{t("advertisement 4")}</option>
                      <option value={5}>{t("advertisement 5")}</option>
                    </Input>
                    {advertisementError?.errors?.priority?.[0] && (
                      <div className="invalid-feedback d-block">
                        {String(advertisementError?.errors?.priority?.[0])}
                      </div>
                    )}
                  </div>
                </Col>

                {/* Replace Priority Checkbox */}
                <Col xxl={4} md={4} sm={6}>
                  <div className="form-check mt-4">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="replacePriority"
                      name="replacePriority"
                      checked={
                        addForm.values.replacePriority as unknown as boolean
                      }
                      onChange={(e) =>
                        addForm.setFieldValue(
                          "replacePriority",
                          e.target.checked
                        )
                      }
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="replacePriority"
                    >
                      {t("replace existed priority?")}
                    </Label>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      color="light"
                      onClick={() => {
                        setmodal_standard(false);
                      }}
                      disabled={isSubmitting}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      type="submit"
                      color="success"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {t("Adding...")}
                        </>
                      ) : (
                        t("Add Advertisement")
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </form>
          </ModalBody>
        </Modal>
        {/* <ToastContainer autoClose={2000} limit={1} /> */}
      </div>
    </React.Fragment>
  );
};

export default Advertisements;
