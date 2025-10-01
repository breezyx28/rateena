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
import { clearAdvertisementError } from "slices/advertisements/reducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
// Removed FilePond in favor of simple input uploader like add-product-modal
import { vendorsList } from "slices/thunks";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useAdvertisementWithValidation } from "../../hooks/useAdvertisementWithValidation";
import { useAdvertisementsList } from "hooks";
import FieldError from "Components/Common/FieldError";

const Advertisements = () => {
  document.title = "Advertisements | Rateena - E-Shop Admin Panel";

  const { i18n, t } = useTranslation();
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const { data: adsData, fetchAdvertisements } = useAdvertisementsList();

  // Use the advertisement with validation hook
  const { formik, submit, data, error, isSuccess, isError, isLoading, reset } =
    useAdvertisementWithValidation({
      onSuccess: (data) => {
        Swal.fire({
          title: t("Advertisement added successfully"),
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setmodal_standard(false);
        reset();
        setSelectedFiles([]);
        // Refresh the advertisements list
        fetchAdvertisements();
      },
      onError: (error) => {
        console.log("Advertisement error:", error);
      },
    });

  React.useEffect(() => {
    fetchAdvertisements();
  }, []);

  React.useEffect(() => {
    if (adsData?.data) {
      console.log("adsData: ", adsData?.data);
    }
  }, [adsData?.data]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      formik.setFieldValue("adsImage1", files.length > 0 ? files[0] : null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFiles([]);
    formik.setFieldValue("adsImage1", null);
  };

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
                      {adsData?.data?.availableBanners &&
                        adsData.data.availableBanners.map(
                          ({ name }: { name: string }, index: number) => (
                            <Col xs={6} sm={3} key={index}>
                              <div className="p-3">
                                <h5 className="mb-1">
                                  <span className={""}>
                                    {Number(index) + 1}
                                  </span>
                                </h5>
                                <p className="text-muted mb-0">
                                  {name ?? "---"}
                                </p>
                              </div>
                            </Col>
                          )
                        )}
                    </Row>
                  </CardHeader>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <AdvertisementsList
                        data={adsData?.data?.list ?? []}
                        vendorsListSuccess={vendorsListSuccess}
                        onRefresh={fetchAdvertisements}
                        availableBanners={adsData?.data?.availableBanners ?? []}
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
                submit();
                return false;
              }}
            >
              {/* Server Error Display */}
              {formik.status?.serverError && (
                <Alert color="danger">
                  {String(formik.status.serverError)}
                </Alert>
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.title}
                      invalid={
                        formik.touched.title && formik.errors.title
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="title" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.arTitle}
                      invalid={
                        formik.touched.arTitle && formik.errors.arTitle
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="arTitle" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.subtitle}
                      invalid={
                        formik.touched.subtitle && formik.errors.subtitle
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="subtitle" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.arSubtitle}
                      invalid={
                        formik.touched.arSubtitle && formik.errors.arSubtitle
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="arSubtitle" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.startDate}
                      invalid={
                        formik.touched.startDate && formik.errors.startDate
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="startDate" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.expireDate}
                      invalid={
                        formik.touched.expireDate && formik.errors.expireDate
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="expireDate" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.startTime}
                      invalid={
                        formik.touched.startTime && formik.errors.startTime
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="startTime" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.endTime}
                      invalid={
                        formik.touched.endTime && formik.errors.endTime
                          ? true
                          : false
                      }
                    />
                    <FieldError formik={formik} name="endTime" />
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.url}
                      invalid={
                        formik.touched.url && formik?.errors?.url ? true : false
                      }
                    />
                    <FieldError formik={formik} name="url" />
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
                      value={formik.values.banner}
                      onChange={(e) => {
                        formik.handleChange(e);
                        const newVal = e.target.value as any;
                        if (
                          newVal === "External Advertisements" ||
                          newVal === "ُاعلانات خارجية" ||
                          newVal == 4
                        ) {
                          // clear and null vendorId on external type
                          formik.setFieldValue("vendorId", "");
                        }
                      }}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">{t("Select advertisement type")}</option>
                      {adsData?.data?.availableBanners?.map(
                        (
                          {
                            name,
                            banner_id,
                          }: { name: string; banner_id: string | number },
                          index: number
                        ) => (
                          <option key={index} value={banner_id}>
                            {name}
                          </option>
                        )
                      )}
                    </Input>
                    <FieldError formik={formik} name="banner" />
                  </div>
                </Col>

                {/* Vendor Selection */}
                {formik.values.banner !== "External Advertisements" ||
                  formik.values.banner !== "ُاعلانات خارجية" ||
                  (formik.values.banner !== 4 && (
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
                              option.value === formik.values.vendorId
                          )}
                          onChange={(selectedOption: any) => {
                            formik.setFieldValue(
                              "vendorId",
                              selectedOption?.value || ""
                            );
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("vendorId", true)
                          }
                          placeholder={t("Select vendor")}
                          isClearable
                          isSearchable
                          className={
                            formik.touched.vendorId && formik.errors.vendorId
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {formik.touched.vendorId && formik.errors.vendorId && (
                          <div className="invalid-feedback d-block">
                            {String(formik.errors.vendorId)}
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}

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
                      value={formik.values.priority}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">{t("Select priority")}</option>
                      <option value={1}>{t("advertisement 1")}</option>
                      <option value={2}>{t("advertisement 2")}</option>
                      <option value={3}>{t("advertisement 3")}</option>
                      <option value={4}>{t("advertisement 4")}</option>
                      <option value={5}>{t("advertisement 5")}</option>
                    </Input>
                    <FieldError formik={formik} name="priority" />
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
                        formik.values.replacePriority as unknown as boolean
                      }
                      onChange={(e) =>
                        formik.setFieldValue(
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
                      disabled={isLoading}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button type="submit" color="success" disabled={isLoading}>
                      {isLoading ? (
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
