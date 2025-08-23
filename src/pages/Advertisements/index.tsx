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
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { AdvertisementsList } from "./AdvertisementsList";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { getAdvertisementsListQuery } from "slices/advertisements/thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { vendorsList } from "slices/thunks";
import Select from "react-select";
import { useTranslation } from "react-i18next";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Advertisements = () => {
  document.title = "Advertisements | Rateena - E-Shop Admin Panel";

  const { i18n } = useTranslation();
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const [addAdImageFiles, setAddAdImageFiles] = useState<any[]>([]);

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
    advertisementsListSuccess: state.advertisementsListSuccess,
    advertisementsError: state.advertisementsError,
  }));
  // Inside your component
  const { advertisementsListSuccess, advertisementsError } = useSelector(
    selectLayoutProperties
  );
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
    if (vendorsListSuccess) {
      console.log("vendorsListSuccess: ", vendorsListSuccess);
    }
    if (advertisementsError) {
      console.log("advertisementsError: ", advertisementsError);
    }
  }, [advertisementsError, advertisementsListSuccess, vendorsListSuccess]);

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
      adsImage1: "",
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
      url: Yup.string().url("Must be a valid URL").nullable(),
      vendorId: Yup.string().required("Vendor is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
        adsImage1:
          addAdImageFiles && addAdImageFiles.length > 0
            ? addAdImageFiles[0]?.file
            : values.adsImage1,
      };
      console.log("Add form values:", payload);
      toast.success("Advertisement added successfully");
      setmodal_standard(false);
      resetForm();
      setAddAdImageFiles([]);
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
                      Add Advertisement
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
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={() => {
              tog_standard();
            }}
          >
            Add Advertisement
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addForm.handleSubmit();
                return false;
              }}
            >
              <Row className="gy-4">
                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="title" className="form-label">
                      English Title
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="arTitle" className="form-label">
                      Arabic Title
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="subtitle" className="form-label">
                      English Subtitle
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="arSubtitle" className="form-label">
                      Arabic Subtitle
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="startDate" className="form-label">
                      Start Date
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="expireDate" className="form-label">
                      End Date
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="startTime" className="form-label">
                      Start Time
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="endTime" className="form-label">
                      End Time
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
                      Redirect URL
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

                {/* Image Upload */}
                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="adsImage1" className="form-label">
                      Advertisement Image
                    </Label>
                    <FilePond
                      id={"adsImage1"}
                      files={addAdImageFiles}
                      onupdatefiles={(files: any) => {
                        setAddAdImageFiles(files);
                        addForm.setFieldValue(
                          "adsImage1",
                          files && files.length > 0 ? files[0]?.file : ""
                        );
                      }}
                      allowMultiple={false}
                      maxFiles={1}
                      name="adsImage1"
                      className="filepond filepond-input-multiple"
                    />
                  </div>
                </Col>

                {/* Banner Type Select */}
                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="banner" className="form-label">
                      Banner Type
                    </Label>
                    <Input
                      type="select"
                      id="banner"
                      name="banner"
                      className="form-select"
                      value={addForm.values.banner}
                      onChange={addForm.handleChange}
                      onBlur={addForm.handleBlur}
                    >
                      <option value="">Select banner type</option>
                      <option value="External Advertisements">
                        External Advertisements
                      </option>
                      <option value="Resturants">Resturants</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Stores">Stores</option>
                    </Input>
                  </div>
                </Col>

                {/* Vendor Selection */}
                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="vendorId" className="form-label">
                      Vendor
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
                      placeholder="Select vendor"
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

                {/* Priority Select */}
                <Col xxl={6} md={6} sm={6}>
                  <div>
                    <Label htmlFor="priority" className="form-label">
                      Priority
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
                      <option value="">Select priority</option>
                      <option value={1}>banner 1</option>
                      <option value={2}>banner 2</option>
                      <option value={3}>banner 3</option>
                      <option value={4}>banner 4</option>
                      <option value={5}>banner 5</option>
                    </Input>
                  </div>
                </Col>

                {/* Replace Priority Checkbox */}
                <Col xxl={6} md={6} sm={6}>
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
                      replace existed priority?
                    </Label>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {
                        setmodal_standard(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="success">
                      Add Advertisement
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

export default Advertisements;
