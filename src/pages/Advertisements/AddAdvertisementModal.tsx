import React, { useState } from "react";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Alert,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import FieldError from "Components/Common/FieldError";

interface AddAdvertisementModalProps {
  isOpen: boolean;
  toggle: () => void;
  formik: any;
  submit: () => void;
  error: any;
  isLoading: boolean;
  vendorOptions: any[];
  adsData: any;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedFile: () => void;
}

const AddAdvertisementModal: React.FC<AddAdvertisementModalProps> = ({
  isOpen,
  toggle,
  formik,
  submit,
  error,
  isLoading,
  vendorOptions,
  adsData,
  selectedFiles,
  setSelectedFiles,
  handleFileChange,
  removeSelectedFile,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      id="myModal"
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      fullscreen={true}
    >
      <ModalHeader className="modal-title" id="myModalLabel" toggle={toggle}>
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
          {formik.status?.serverError && (
            <Alert color="danger">{String(formik.status.serverError)}</Alert>
          )}
          {error?.error && <Alert color="danger">{String(error?.error)}</Alert>}
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
                    formik.touched.title && formik.errors.title ? true : false
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
                <Flatpickr
                  className={`form-control ${
                    formik.touched.startTime && formik.errors.startTime
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.startTime}
                  onChange={(date: any) =>
                    formik.setFieldValue(
                      "startTime",
                      date[0] ? date[0].toTimeString().slice(0, 5) : ""
                    )
                  }
                  onBlur={() => formik.setFieldTouched("startTime", true)}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
                />
                <FieldError formik={formik} name="startTime" />
              </div>
            </Col>

            <Col xxl={4} md={4}>
              <div>
                <Label htmlFor="endTime" className="form-label">
                  {t("End Time")}
                </Label>
                <Flatpickr
                  className={`form-control ${
                    formik.touched.endTime && formik.errors.endTime
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.endTime}
                  onChange={(date: any) =>
                    formik.setFieldValue(
                      "endTime",
                      date[0] ? date[0].toTimeString().slice(0, 5) : ""
                    )
                  }
                  onBlur={() => formik.setFieldTouched("endTime", true)}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
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

            {formik.values.banner !== 4 && formik.values.banner !== "4" && (
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
                      (option: any) => option.value === formik.values.vendorId
                    )}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue(
                        "vendorId",
                        selectedOption?.value || ""
                      );
                    }}
                    onBlur={() => formik.setFieldTouched("vendorId", true)}
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

            <Col xxl={4} md={4} sm={6}>
              <div className="form-check mt-4">
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id="replacePriority"
                  name="replacePriority"
                  checked={formik.values.replacePriority as unknown as boolean}
                  onChange={(e) =>
                    formik.setFieldValue("replacePriority", e.target.checked)
                  }
                />
                <Label className="form-check-label" htmlFor="replacePriority">
                  {t("replace existed priority?")}
                </Label>
              </div>
            </Col>

            <Col xxl={12} md={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button color="light" onClick={toggle} disabled={isLoading}>
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
  );
};

export default AddAdvertisementModal;
