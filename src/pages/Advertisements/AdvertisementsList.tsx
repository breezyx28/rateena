import React, { useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Card,
  CardBody,
  CardHeader,
  Table,
  Alert,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import { imgURL } from "services/api-handles";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateAdvertisementMutation } from "slices/thunks";
import { createSelector } from "reselect";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AdvertisementsList = ({
  data,
  vendorsListSuccess,
}: {
  data: any[];
  vendorsListSuccess?: any;
}) => {
  const { i18n } = useTranslation();
  const [imageModal, setImageModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [adImageFiles, setAdImageFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dispatch: any = useDispatch();

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

  // Create vendor options for react-select
  const vendorOptions = useMemo(() => {
    if (!vendorsListSuccess?.list) return [];

    return vendorsListSuccess.list.map((vendor: any) => ({
      value: vendor.vendorId,
      label: i18n.dir() === "rtl" ? vendor.arFullName : vendor.fullName,
    }));
  }, [vendorsListSuccess, i18n]);

  const isExpired = (expireDate: string, endTime: string) => {
    const now = new Date();
    const expireDateTime = new Date(`${expireDate} ${endTime}`);
    return now > expireDateTime;
  };

  const groupedAdvertisements = useMemo(() => {
    if (!data) return {};

    // Filter data based on search term and status
    let filteredData = [...data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter((ad) => {
        return (
          ad.title?.toLowerCase().includes(searchLower) ||
          ad.arTitle?.toLowerCase().includes(searchLower) ||
          ad.subtitle?.toLowerCase().includes(searchLower) ||
          ad.arSubtitle?.toLowerCase().includes(searchLower) ||
          ad.url?.toLowerCase().includes(searchLower) ||
          ad.vendor?.full_name?.toLowerCase().includes(searchLower) ||
          ad.vendor?.arFullName?.toLowerCase().includes(searchLower) ||
          ad.banner?.toLowerCase().includes(searchLower) ||
          ad.startDate?.toLowerCase().includes(searchLower) ||
          ad.expireDate?.toLowerCase().includes(searchLower) ||
          ad.startTime?.toLowerCase().includes(searchLower) ||
          ad.endTime?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (statusFilter) {
      filteredData = filteredData.filter((ad) => {
        const isExpiredAd = isExpired(ad.expireDate, ad.endTime);
        if (statusFilter === "active") {
          return !isExpiredAd;
        } else if (statusFilter === "expired") {
          return isExpiredAd;
        }
        return true;
      });
    }

    const sorted = filteredData.sort((a, b) => a.priority - b.priority);
    return sorted.reduce((groups, item) => {
      const priority = item.priority;
      if (!groups[priority]) {
        groups[priority] = [];
      }
      groups[priority].push(item);
      return groups;
    }, {} as Record<number, any[]>);
  }, [data, searchTerm, statusFilter]);

  const getAdvertisementType = (banner: string) => {
    if (!banner || banner === "") return "Internal";
    if (banner === "DEFAULT-BANNER-TYPE") return "Default";
    return "External";
  };

  const handleImageView = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModal(true);
  };

  const handleEdit = (ad: any) => {
    setSelectedAd(ad);
    setEditModal(true);

    // Preload defaults
    setAdImageFiles([]);
  };

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

  const handleDelete = (ad: any) => {
    setSelectedAd(ad);
    setDeleteModal(true);
  };

  const handleToggleVisibility = (ad: any) => {
    console.log(
      "Toggle visibility for ad:",
      ad.advertisementId,
      "New status:",
      !ad.isShown
    );
    toast.success(
      `Advertisement ${ad.isShown ? "hidden" : "shown"} successfully`
    );
  };
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
      banner: selectedAd?.banner || "",
      priority: selectedAd?.priority || "",
      vendorId: selectedAd?.vendorId || selectedAd?.vendor?.vendor_id || "",
      replacePriority: false,
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
      url: Yup.string().url("Must be a valid URL").nullable(),
      vendorId: Yup.string(),
    }),
    onSubmit: (values) => {
      // clear any previous server error
      editForm.setStatus(undefined);
      setIsSubmitting(true);

      const normalizedValues = {
        ...values,
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

      dispatch(addOrUpdateAdvertisementMutation(formData));
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  // Show success toast when advertisement is updated successfully
  React.useEffect(() => {
    if (advertisementUpdatedSuccess && !advertisementError) {
      toast.success("Advertisement updated successfully");
      setEditModal(false);
      editForm.resetForm();
      setSelectedFiles([]);
      setIsSubmitting(false);
    }
  }, [advertisementUpdatedSuccess, advertisementError]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Advertisements by Priority</h4>
        </CardHeader>
        <CardBody>
          {/* Search and Filter Section */}
          <Row className="mb-3">
            <Col lg={6} md={6}>
              <div className="search-box">
                <Input
                  type="text"
                  className="form-control search"
                  placeholder="Search advertisements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </Col>
            <Col lg={4} md={4}>
              <div>
                <Input
                  type="select"
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </Input>
              </div>
            </Col>
            <Col lg={2} md={2}>
              <div>
                <Button
                  color="light"
                  className="w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  }}
                  disabled={!searchTerm && !statusFilter}
                >
                  <i className="ri-refresh-line me-1"></i>
                  Clear
                </Button>
              </div>
            </Col>
          </Row>

          {/* Results Summary */}
          {(searchTerm || statusFilter) && (
            <div className="mb-3">
              <p className="text-muted mb-0">
                <i className="ri-information-line me-1"></i>
                Showing{" "}
                {Object.values(
                  groupedAdvertisements as Record<number, any[]>
                ).reduce(
                  (total: number, ads: any[]) => total + ads.length,
                  0
                )}{" "}
                result(s)
                {searchTerm && ` for "${searchTerm}"`}
                {statusFilter && ` with status "${statusFilter}"`}
              </p>
            </div>
          )}

          <div className="table-responsive">
            {Object.keys(groupedAdvertisements).length === 0 ? (
              <div className="text-center py-4">
                <i className="ri-search-line fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">No advertisements found</h5>
                <p className="text-muted">
                  {searchTerm || statusFilter
                    ? "Try adjusting your search criteria or filters."
                    : "No advertisements available at the moment."}
                </p>
              </div>
            ) : (
              <Table className="table-centered align-middle table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th>English Title</th>
                    <th>Arabic Title</th>
                    <th>English Subtitle</th>
                    <th>Arabic Subtitle</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Redirect Link</th>
                    <th>Vendor Name</th>
                    <th>Ad Type</th>
                    <th>Image</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedAdvertisements).map((priority) => {
                    const ads = groupedAdvertisements[parseInt(priority)];
                    return (
                      <React.Fragment key={priority}>
                        <tr className="table-primary">
                          <td colSpan={14} className="fw-bold text-center">
                            <i className="ri-star-fill me-2"></i>
                            Banner: {priority}
                            <span className="badge bg-light text-dark ms-2">
                              {ads.length}{" "}
                              {ads.length === 1
                                ? "Advertisement"
                                : "Advertisements"}
                            </span>
                          </td>
                        </tr>
                        {ads.map((ad: any, index: number) => (
                          <tr key={`${priority}-${index}`}>
                            <td>
                              <span className="fw-medium">{ad.title}</span>
                            </td>
                            <td>
                              <span className="fw-medium" dir="rtl">
                                {ad.arTitle}
                              </span>
                            </td>
                            <td>{ad.subtitle}</td>
                            <td>
                              <span dir="rtl">{ad.arSubtitle}</span>
                            </td>
                            <td>{ad.startDate}</td>
                            <td>{ad.expireDate}</td>
                            <td>{ad.startTime}</td>
                            <td>{ad.endTime}</td>
                            <td>
                              {ad.url ? (
                                <a
                                  href={ad.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary"
                                  style={{
                                    maxWidth: "150px",
                                    display: "inline-block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={ad.url}
                                >
                                  {ad.url.length > 20
                                    ? ad.url.substring(0, 20) + "..."
                                    : ad.url}
                                </a>
                              ) : (
                                <span className="text-muted">No link</span>
                              )}
                            </td>
                            <td>{ad.vendor?.full_name}</td>
                            <td>
                              {(() => {
                                const type = getAdvertisementType(ad.banner);
                                const badgeClass =
                                  type === "Internal"
                                    ? "bg-success"
                                    : type === "External"
                                    ? "bg-warning"
                                    : "bg-info";
                                return (
                                  <span className={`badge ${badgeClass}`}>
                                    {type}
                                  </span>
                                );
                              })()}
                            </td>
                            <td>
                              {ad.adsImage1 ? (
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleImageView(ad.adsImage1)}
                                >
                                  <i className="ri-image-line me-1"></i>
                                  View
                                </Button>
                              ) : (
                                <span className="text-muted">No image</span>
                              )}
                            </td>
                            <td>
                              {(() => {
                                const expired = isExpired(
                                  ad.expireDate,
                                  ad.endTime
                                );
                                const badgeClass = expired
                                  ? "bg-danger"
                                  : "bg-success";
                                const text = expired ? "Expired" : "Active";
                                return (
                                  <span className={`badge ${badgeClass}`}>
                                    {text}
                                  </span>
                                );
                              })()}
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-items-center">
                                <div
                                  className="form-check form-switch"
                                  dir="ltr"
                                >
                                  <Input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={ad.isShown}
                                    onChange={() => handleToggleVisibility(ad)}
                                  />
                                </div>
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => handleEdit(ad)}
                                  title="Edit"
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDelete(ad)}
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={imageModal}
        toggle={() => setImageModal(false)}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => setImageModal(false)}>
          Advertisement Image
        </ModalHeader>
        <ModalBody>
          {selectedImage && (
            <div className="text-center">
              <img
                src={imgURL + "/" + selectedImage}
                alt="Advertisement"
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={editModal}
        toggle={() => {
          setEditModal(false);
          setSelectedAd(null);
        }}
        size="lg"
        centered
      >
        <ModalHeader
          toggle={() => {
            setEditModal(false);
            setSelectedAd(null);
          }}
        >
          Edit Advertisement
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              editForm.handleSubmit();
              return false;
            }}
          >
            {editForm.status?.serverError && (
              <>
                {toast("Error updating advertisement", {
                  position: "top-right",
                  hideProgressBar: false,
                  className: "bg-danger text-white",
                  progress: undefined,
                  toastId: "advertisement-error",
                })}
                <ToastContainer autoClose={2000} limit={1} />
                <Alert color="danger">
                  {String(editForm.status.serverError)}
                </Alert>
              </>
            )}
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.title}
                    invalid={
                      editForm.touched.title && editForm.errors.title
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.arTitle}
                    invalid={
                      editForm.touched.arTitle && editForm.errors.arTitle
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.subtitle}
                    invalid={
                      editForm.touched.subtitle && editForm.errors.subtitle
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.arSubtitle}
                    invalid={
                      editForm.touched.arSubtitle && editForm.errors.arSubtitle
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.startDate}
                    invalid={
                      editForm.touched.startDate && editForm.errors.startDate
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.expireDate}
                    invalid={
                      editForm.touched.expireDate && editForm.errors.expireDate
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.startTime}
                    invalid={
                      editForm.touched.startTime && editForm.errors.startTime
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.endTime}
                    invalid={
                      editForm.touched.endTime && editForm.errors.endTime
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
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                    value={editForm.values.url}
                    invalid={
                      editForm.touched.url && editForm.errors.url ? true : false
                    }
                  />
                </div>
              </Col>

              {/* Image Upload (aligned with add-product-modal.tsx) */}
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="adsImage1" className="form-label">
                    Advertisement Image
                  </Label>
                  <Input
                    type="file"
                    id="adsImage1"
                    name="adsImage1"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                  />

                  {/* Show existing image if available */}
                  {selectedAd?.adsImage1 && selectedFiles.length === 0 && (
                    <div className="mt-3">
                      <Label className="form-label text-muted">
                        Current Image:
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

                  {/* Show selected new image */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3">
                      <Label className="form-label text-muted">
                        Selected Image:
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
                    value={editForm.values.banner}
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
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
                      (option: any) => option.value === editForm.values.vendorId
                    )}
                    onChange={(selectedOption: any) => {
                      editForm.setFieldValue(
                        "vendorId",
                        selectedOption?.value || ""
                      );
                    }}
                    onBlur={() => editForm.setFieldTouched("vendorId", true)}
                    placeholder="Select vendor"
                    isClearable
                    isSearchable
                    className={
                      editForm.touched.vendorId && editForm.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {editForm.touched.vendorId && editForm.errors.vendorId && (
                    <div className="invalid-feedback d-block">
                      {String(editForm.errors.vendorId)}
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
                    value={editForm.values.priority}
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
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
              <Col xxl={6} md={6} sm={6}>
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
                      editForm.setFieldValue(
                        "replacePriority",
                        e.target.checked
                      )
                    }
                  />
                  <Label className="form-check-label" htmlFor="replacePriority">
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
                      setEditModal(false);
                      setSelectedAd(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="success">
                    Update Advertisement
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => {
          console.log("Deleting advertisement:", selectedAd?.advertisementId);
          toast.success("Advertisement deleted successfully");
          setDeleteModal(false);
          setSelectedAd(null);
        }}
        onCloseClick={() => {
          setDeleteModal(false);
          setSelectedAd(null);
        }}
        recordId={selectedAd?.advertisementId}
      />

      <ToastContainer autoClose={2000} limit={1} />
    </React.Fragment>
  );
};

export { AdvertisementsList };
