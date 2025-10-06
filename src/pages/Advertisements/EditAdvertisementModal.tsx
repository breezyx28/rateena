import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Alert,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateAdvertisementMutation } from "slices/thunks";
import {
  clearAdvertisementError,
  resetAdvertisementState,
} from "slices/advertisements/reducer";
import { createSelector } from "reselect";
import { imgURL } from "services/api-handles";
import FieldError from "Components/Common/FieldError";

interface EditAdvertisementModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedAd: any;
  availableBanners: any[];
  vendorOptions: any[];
  onSuccess?: () => void;
}

const EditAdvertisementModal: React.FC<EditAdvertisementModalProps> = ({
  isOpen,
  toggle,
  selectedAd,
  availableBanners,
  vendorOptions,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectLayoutState = (state: any) => state.Advertisements;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    advertisementError: state.advertisementError,
    advertisementUpdatedSuccess: state.advertisementUpdatedSuccess,
  }));

  const { advertisementError, advertisementUpdatedSuccess } = useSelector(
    selectLayoutProperties
  );

  const convertTimeFormat = (timeString: string) => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;

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

  const editForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: selectedAd?.title || "",
      arTitle: selectedAd?.arTitle || "",
      subtitle: selectedAd?.subtitle || "",
      arSubtitle: selectedAd?.arSubtitle || "",
      startDate: selectedAd?.startDate || "",
      expireDate: selectedAd?.expireDate || "",
      startTime: convertTimeFormat(selectedAd?.startTime || ""),
      endTime: convertTimeFormat(selectedAd?.endTime || ""),
      url: selectedAd?.url || "",
      banner: selectedAd?.banner_id || "",
      priority: null,
      vendorId: selectedAd?.vendor?.vendor_id || "",
      replacePriority: null,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string(),
      arTitle: Yup.string(),
      subtitle: Yup.string(),
      arSubtitle: Yup.string(),
      startDate: Yup.date(),
      expireDate: Yup.date(),
      startTime: Yup.string(),
      endTime: Yup.string(),
      url: Yup.string()
        .nullable()
        .test(
          "url-vendor-conflict",
          t("Cannot select vendor and URL at sametime") ||
            "لا يمكن تقديم الرابط ومعرف المتجر معاً",
          function (value) {
            const { vendorId } = this.parent;
            return !(value && vendorId);
          }
        ),
      vendorId: Yup.string()
        .nullable()
        .when("banner", {
          is: (val: any) => {
            console.log("banner-value: ", val);
            return val != "4" || val != 4;
          },
          then: (schema) =>
            schema.required(t("Vendor is required") || "المورد مطلوب"),
          otherwise: (schema) => schema.nullable(),
        }),
      priority: Yup.number().nullable(),
      // .when("banner", {
      //   is: (val: any) => val !== 4,
      //   then: (schema) => schema.required(t("Priority is required") || "الأولوية مطلوبة"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      replacePriority: Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
      console.log("values: ", values);

      try {
        editForm.setStatus(undefined);
        dispatch(clearAdvertisementError());
        setIsSubmitting(true);

        const normalizedValues = {
          ...values,
          vendorId: values.vendorId === "" ? null : values.vendorId,
          advertisementId: selectedAd.advertisementId,
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

        console.log("Payload:", payload);
        for (let [key, value] of Array.from(formData.entries())) {
          console.log(key, value);
        }

        dispatch(addOrUpdateAdvertisementMutation(formData));
      } catch (error) {
        console.error("Error:", error);
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    editForm.setFieldValue(
      "adsImage1",
      files && files.length > 0 ? files[0] : null
    );
  };

  const removeSelectedFile = () => {
    setSelectedFiles([]);
    editForm.setFieldValue("adsImage1", null);
  };

  React.useEffect(() => {
    // if (editForm?.errors) {
    //   console.log("editForm: ", editForm?.errors);
    // }
    if (!advertisementError) return;

    const serverMessage = advertisementError?.message;
    const serverErrors = advertisementError?.errors || {};
    console.log("Server Message:", serverMessage);
    console.log("Server Errors:", serverErrors);

    editForm.setStatus({ serverError: serverMessage });
    if (serverErrors && typeof serverErrors === "object") {
      Object.entries(serverErrors).forEach(([key, value]) => {
        const firstMessage = Array.isArray(value)
          ? String(value[0])
          : String(value);
        console.log(`Setting field error for ${key}:`, firstMessage);
        if (key in editForm.values) {
          editForm.setFieldError(key as any, firstMessage);
        }
      });
    }
  }, [advertisementError]);

  React.useEffect(() => {
    if (advertisementUpdatedSuccess) {
      console.log("Success! Resetting form and calling onSuccess");
      editForm.resetForm();
      setSelectedFiles([]);
      setIsSubmitting(false);
      onSuccess?.();
      dispatch(resetAdvertisementState());
    } else if (advertisementError) {
      console.log("Error occurred, setting isSubmitting to false");
      setIsSubmitting(false);
    }
  }, [advertisementUpdatedSuccess, advertisementError]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>{t("Edit Advertisement")}</ModalHeader>
      <ModalBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            editForm.handleSubmit();
            return false;
          }}
        >
          {editForm.status?.serverError && (
            <Alert color="danger">{String(editForm.status.serverError)}</Alert>
          )}
          {editForm?.errors?.vendorId && (
            <Alert color="danger">{String(editForm?.errors.vendorId)}</Alert>
          )}
          <Row className="gy-4">
            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="title" className="form-label">
                  {t("English Title")}
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.title}
                  invalid={
                    editForm.touched.title && editForm.errors.title
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="title" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="arTitle" className="form-label">
                  {t("Arabic Title")}
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="arTitle"
                  name="arTitle"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.arTitle}
                  invalid={
                    editForm.touched.arTitle && editForm.errors.arTitle
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="arTitle" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="subtitle" className="form-label">
                  {t("English Subtitle")}
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="subtitle"
                  name="subtitle"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.subtitle}
                  invalid={
                    editForm.touched.subtitle && editForm.errors.subtitle
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="subtitle" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="arSubtitle" className="form-label">
                  {t("Arabic Subtitle")}
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="arSubtitle"
                  name="arSubtitle"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.arSubtitle}
                  invalid={
                    editForm.touched.arSubtitle && editForm.errors.arSubtitle
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="arSubtitle" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="startDate" className="form-label">
                  {t("Start Date")}
                </Label>
                <Input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.startDate}
                  invalid={
                    editForm.touched.startDate && editForm.errors.startDate
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="startDate" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="expireDate" className="form-label">
                  {t("End Date")}
                </Label>
                <Input
                  type="date"
                  className="form-control"
                  id="expireDate"
                  name="expireDate"
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.expireDate}
                  invalid={
                    editForm.touched.expireDate && editForm.errors.expireDate
                      ? true
                      : false
                  }
                />
                <FieldError formik={editForm} name="expireDate" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="startTime" className="form-label">
                  {t("Start Time")}
                </Label>
                <Flatpickr
                  className={`form-control ${
                    editForm.touched.startTime && editForm.errors.startTime
                      ? "is-invalid"
                      : ""
                  }`}
                  value={editForm.values.startTime}
                  onChange={(date) =>
                    editForm.setFieldValue(
                      "startTime",
                      date[0] ? date[0].toTimeString().slice(0, 5) : ""
                    )
                  }
                  onBlur={() =>
                    editForm.setFieldTouched("startTime", true)
                  }
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
                />
                <FieldError formik={editForm} name="startTime" />
              </div>
            </Col>

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="endTime" className="form-label">
                  {t("End Time")}
                </Label>
                <Flatpickr
                  className={`form-control ${
                    editForm.touched.endTime && editForm.errors.endTime
                      ? "is-invalid"
                      : ""
                  }`}
                  value={editForm.values.endTime}
                  onChange={(date) =>
                    editForm.setFieldValue(
                      "endTime",
                      date[0] ? date[0].toTimeString().slice(0, 5) : ""
                    )
                  }
                  onBlur={() =>
                    editForm.setFieldTouched("endTime", true)
                  }
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
                />
                <FieldError formik={editForm} name="endTime" />
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
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                  value={editForm.values.url}
                  invalid={editForm.touched.url && !!editForm.errors.url}
                />
                <FieldError formik={editForm} name="url" />
              </div>
            </Col>

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

                {selectedAd?.adsImage1 && selectedFiles.length === 0 && (
                  <div className="mt-3">
                    <Label className="form-label text-muted">
                      {t("Current Image:")}
                    </Label>
                    <div className="d-flex gap-2 flex-wrap">
                      <div className="position-relative">
                        <img
                          src={imgURL + "/" + selectedAd.adsImage1}
                          alt="Current Advertisement"
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

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

            <Col xxl={6} md={6}>
              <div>
                <Label htmlFor="banner" className="form-label">
                  {t("Banner Type")}
                </Label>
                <Input
                  type="select"
                  id="banner"
                  name="banner"
                  className="form-select"
                  onChange={(e) => {
                    editForm.handleChange(e);
                    // Reset vendorId to null when banner value is 4
                    if (e.target.value == "4") {
                      editForm.setFieldValue("vendorId", null);
                    }
                  }}
                  onBlur={editForm.handleBlur}
                >
                  <option value="">{t("Select banner type")}</option>
                  {availableBanners?.map(
                    (
                      {
                        name,
                        banner_id,
                      }: { name: string; banner_id: string | number },
                      index: number
                    ) => (
                      <option
                        key={index}
                        value={banner_id}
                        selected={selectedAd?.banner_id === banner_id}
                      >
                        {name}
                      </option>
                    )
                  )}
                </Input>
              </div>
            </Col>

            {editForm.values.banner !== "4" && editForm.values.banner !== 4 && (
              <Col xxl={6} md={6}>
                <div>
                  <Label htmlFor="vendorId" className="form-label">
                    {t("Vendor")}
                  </Label>
                  <Select
                    id="vendorId"
                    name="vendorId"
                    options={vendorOptions}
                    value={vendorOptions.find((option: any) => {
                      return (
                        option.value ===
                        (editForm.values.vendorId ||
                          selectedAd?.vendor?.vendor_id)
                      );
                    })}
                    onChange={(selectedOption: any) => {
                      editForm.setFieldValue(
                        "vendorId",
                        selectedOption?.value || null
                      );
                    }}
                    onBlur={() => editForm.setFieldTouched("vendorId", true)}
                    placeholder={t("Select vendor")}
                    isClearable
                    isSearchable
                    className={
                      editForm.touched.vendorId && !!editForm.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <FieldError formik={editForm} name="vendorId" />
                </div>
              </Col>
            )}

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
                  defaultValue={
                    (selectedAd?.priority ??
                      editForm.values.priority ??
                      "") as any
                  }
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                >
                  <option value="">{t("Select priority")}</option>
                  <option value={1}>{t("advertisement 1")}</option>
                  <option value={2}>{t("advertisement 2")}</option>
                  <option value={3}>{t("advertisement 3")}</option>
                  <option value={4}>{t("advertisement 4")}</option>
                  <option value={5}>{t("advertisement 5")}</option>
                </Input>
                <FieldError formik={editForm} name="priority" />
              </div>
            </Col>

            <Col xxl={4} md={4} sm={6}>
              <div className="form-check mt-4">
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id="replacePriority"
                  name="replacePriority"
                  checked={
                    editForm.values.replacePriority as unknown as boolean
                  }
                  onChange={(e) =>
                    editForm.setFieldValue("replacePriority", e.target.checked)
                  }
                />
                <Label className="form-check-label" htmlFor="replacePriority">
                  {t("replace existed priority?")}
                </Label>
              </div>
            </Col>

            <Col xxl={12} md={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button type="button" color="light" onClick={toggle}>
                  {t("Cancel")}
                </Button>
                <Button type="submit" color="success">
                  {t("Update Advertisement")}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditAdvertisementModal;
