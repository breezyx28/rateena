import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import DeleteModal from "../../Components/Common/DeleteModal";
import EditAdvertisementModal from "./EditAdvertisementModal";
import { imgURL } from "services/api-handles";
import { useTranslation } from "react-i18next";
import { useDeleteAdvertisement, useToggleAdvertisement } from "hooks";

const AdvertisementsList = ({
  data,
  availableBanners,
  vendorsListSuccess,
  onRefresh,
}: {
  data: any[];
  availableBanners: any[];
  vendorsListSuccess?: any;
  onRefresh?: () => void;
}) => {
  const { i18n, t } = useTranslation();
  const [imageModal, setImageModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const {
    deleteAdvertisement,
    isLoading: isDeleting,
    isSuccess: deleteSuccess,
  } = useDeleteAdvertisement();
  const {
    toggleAdvertisement,
    isLoading: isToggling,
    isSuccess: toggleSuccess,
  } = useToggleAdvertisement();

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
      const banner = item.banner || "External Advertisements";
      if (!groups[banner]) {
        groups[banner] = [];
      }
      groups[banner].push(item);
      return groups;
    }, {} as Record<string, any[]>);
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
  };

  const handleDelete = (ad: any) => {
    setSelectedAd(ad);
    setDeleteModal(true);
  };

  const handleToggleVisibility = (ad: any) => {
    toggleAdvertisement(ad.advertisementId);
  };

  const handleEditSuccess = () => {
    Swal.fire({
      title: t("Advertisement updated successfully"),
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    setEditModal(false);
    setSelectedAd(null);
    onRefresh?.();
  };

  // Handle delete success
  React.useEffect(() => {
    if (deleteSuccess) {
      Swal.fire({
        title: t("Advertisement deleted successfully"),
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onRefresh?.();
    }
  }, [deleteSuccess]);

  // Handle toggle success
  React.useEffect(() => {
    if (toggleSuccess) {
      Swal.fire({
        title: t("Advertisement visibility updated successfully"),
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onRefresh?.();
    }
  }, [toggleSuccess]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">{t("Advertisements by Banner")}</h4>
        </CardHeader>
        <CardBody>
          {/* Search and Filter Section */}
          <Row className="mb-3">
            <Col lg={6} md={6}>
              <div className="search-box">
                <Input
                  type="text"
                  className="form-control search"
                  placeholder={t("Search advertisements...")}
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
                  <option value="">{t("All Status")}</option>
                  <option value="active">{t("Active")}</option>
                  <option value="expired">{t("Expired")}</option>
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
                  {t("Clear")}
                </Button>
              </div>
            </Col>
          </Row>

          {/* Results Summary */}
          {(searchTerm || statusFilter) && (
            <div className="mb-3">
              <p className="text-muted mb-0">
                <i className="ri-information-line me-1"></i>
                {t("Showing")}{" "}
                {Object.values(
                  groupedAdvertisements as Record<string, any[]>
                ).reduce(
                  (total: number, ads: any[]) => total + ads.length,
                  0
                )}{" "}
                {t("result(s)")}
                {searchTerm && ` ${t("for")} "${searchTerm}"`}
                {statusFilter && ` ${t("with status")} "${statusFilter}"`}
              </p>
            </div>
          )}

          <div className="table-responsive">
            {Object.keys(groupedAdvertisements).length === 0 ? (
              <div className="text-center py-4">
                <i className="ri-search-line fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">{t("No advertisements found")}</h5>
                <p className="text-muted">
                  {searchTerm || statusFilter
                    ? t("Try adjusting your search criteria or filters.")
                    : t("No advertisements available at the moment.")}
                </p>
              </div>
            ) : (
              <Table className="table-centered align-middle table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th>{t("Title")}</th>
                    <th>{t("Subtitle")}</th>
                    <th>{t("Start Date")}</th>
                    <th>{t("End Date")}</th>
                    <th>{t("Vendor Name")}</th>
                    <th>{t("Image")}</th>
                    <th>{t("Visibility")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedAdvertisements).map((banner) => {
                    const ads = groupedAdvertisements[banner];
                    return (
                      <React.Fragment key={banner}>
                        <tr className="table-primary">
                          <td colSpan={14} className="fw-bold text-center">
                            <i className="ri-star-fill me-2"></i>
                            {t("Banner:")}: {t(banner)}
                            <span className="badge bg-light text-dark ms-2">
                              {ads.length}{" "}
                              {ads.length === 1
                                ? t("Advertisement")
                                : t("Advertisements")}
                            </span>
                          </td>
                        </tr>
                        {ads.map((ad: any, index: number) => (
                          <tr key={`${banner}-${index}`}>
                            <td>
                              <span className="fw-medium">
                                {i18n.dir() === "rtl" ? ad.arTitle : ad.title}
                              </span>
                            </td>
                            <td>
                              {i18n.dir() === "rtl"
                                ? ad.arSubtitle
                                : ad.subtitle}
                            </td>

                            <td>{ad.startDate}</td>
                            <td>{ad.expireDate}</td>

                            <td>{ad.vendor?.full_name}</td>

                            <td>
                              {ad.adsImage1 ? (
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleImageView(ad.adsImage1)}
                                >
                                  <i className="ri-image-line me-1"></i>
                                  {t("View")}
                                </Button>
                              ) : (
                                <span className="text-muted">
                                  {t("No image")}
                                </span>
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
                                const text = expired
                                  ? t("Expired")
                                  : t("Active");
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
                                    title={t("Toggle Visibility")}
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
          {t("Advertisement Image")}
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

      <EditAdvertisementModal
        isOpen={editModal}
        toggle={() => {
          setEditModal(false);
          setSelectedAd(null);
        }}
        selectedAd={selectedAd}
        availableBanners={availableBanners}
        vendorOptions={vendorOptions}
        onSuccess={handleEditSuccess}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => {
          if (selectedAd?.advertisementId) {
            deleteAdvertisement(selectedAd.advertisementId);
          }
          setDeleteModal(false);
          setSelectedAd(null);
        }}
        onCloseClick={() => {
          setDeleteModal(false);
          setSelectedAd(null);
        }}
        recordId={selectedAd?.advertisementId}
      />
    </React.Fragment>
  );
};

export { AdvertisementsList };
