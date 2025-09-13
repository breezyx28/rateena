import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Alert,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  //   useAdvertisementWithValidation,
  useAdvertisementsList,
} from "../../hooks/useAdvertisement";
import { useAdvertisementWithValidation as useAdvertisementWithValidationHook } from "../../hooks/useAdvertisementWithValidation";

const AdvertisementsWithHook = () => {
  const { t } = useTranslation();
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Use the advertisements list hook
  const advertisementsListHook = useAdvertisementsList();

  // Use the advertisement with validation hook
  const { formik, submit, data, error, isSuccess, isError, isLoading, reset } =
    useAdvertisementWithValidationHook({
      onSuccess: (data) => {
        toast.success(t("Advertisement added successfully"));
        setmodal_standard(false);
        reset();
        setSelectedFiles([]);
        // Refresh the advertisements list
        advertisementsListHook.fetchAdvertisements();
      },
      onError: (error) => {
        console.log("Advertisement error:", error);
      },
    });

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

  const tog_standard = () => {
    setmodal_standard(!modal_standard);
    if (!modal_standard) {
      reset();
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xxl={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    {t("Advertisements with Hook")}
                  </h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xxl={12} md={12}>
                      <div className="hstack gap-2 justify-content-end">
                        <Button
                          color="success"
                          onClick={tog_standard}
                          disabled={isLoading}
                        >
                          {t("Add Advertisement")}
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {/* Advertisements List */}
                  <Row className="mt-4">
                    <Col xxl={12}>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>{t("Title")}</th>
                              <th>{t("Banner Type")}</th>
                              <th>{t("Priority")}</th>
                              <th>{t("Status")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {advertisementsListHook.data?.list?.map(
                              (ad: any, index: number) => (
                                <tr key={index}>
                                  <td>{ad.title}</td>
                                  <td>{ad.banner}</td>
                                  <td>{ad.priority}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        ad.isShowing
                                          ? "bg-success"
                                          : "bg-danger"
                                      }`}
                                    >
                                      {ad.isShowing
                                        ? t("Active")
                                        : t("Inactive")}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Add Advertisement Modal */}
        <Modal
          id="myModal"
          isOpen={modal_standard}
          toggle={tog_standard}
          size="lg"
          fullscreen={true}
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={tog_standard}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.title}
                      invalid={
                        formik.touched.title && formik.errors.title
                          ? true
                          : false
                      }
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="invalid-feedback">
                        {formik.errors.title}
                      </div>
                    )}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.arTitle}
                      invalid={
                        formik.touched.arTitle && formik.errors.arTitle
                          ? true
                          : false
                      }
                    />
                    {formik.touched.arTitle && formik.errors.arTitle && (
                      <div className="invalid-feedback">
                        {formik.errors.arTitle}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="banner" className="form-label">
                      {t("Banner Type")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      className="form-control"
                      id="banner"
                      name="banner"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.banner}
                      invalid={
                        formik.touched.banner && formik.errors.banner
                          ? true
                          : false
                      }
                    >
                      <option value="">{t("Select Banner Type")}</option>
                      <option value="Vendor Advertisements">
                        {t("Vendor Advertisements")}
                      </option>
                      <option value="External Advertisements">
                        {t("External Advertisements")}
                      </option>
                    </Input>
                    {formik.touched.banner && formik.errors.banner && (
                      <div className="invalid-feedback">
                        {formik.errors.banner}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="priority" className="form-label">
                      {t("Priority")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="priority"
                      name="priority"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.priority || ""}
                      invalid={
                        formik.touched.priority && formik.errors.priority
                          ? true
                          : false
                      }
                    />
                    {formik.touched.priority && formik.errors.priority && (
                      <div className="invalid-feedback">
                        {formik.errors.priority}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="url" className="form-label">
                      {t("URL")}
                    </Label>
                    <Input
                      type="url"
                      className="form-control"
                      id="url"
                      name="url"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.url}
                      invalid={
                        formik.touched.url && formik.errors.url ? true : false
                      }
                    />
                    {formik.touched.url && formik.errors.url && (
                      <div className="invalid-feedback">
                        {formik.errors.url}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="adsImage1" className="form-label">
                      {t("Advertisement Image")}
                    </Label>
                    <Input
                      type="file"
                      className="form-control"
                      id="adsImage1"
                      name="adsImage1"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          {t("Selected file")}: {selectedFiles[0].name}
                        </small>
                        <Button
                          type="button"
                          color="danger"
                          size="sm"
                          className="ms-2"
                          onClick={removeSelectedFile}
                        >
                          {t("Remove")}
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      color="light"
                      onClick={tog_standard}
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
        <ToastContainer autoClose={2000} limit={1} />
      </div>
    </React.Fragment>
  );
};

export default AdvertisementsWithHook;
