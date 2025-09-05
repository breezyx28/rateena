import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Badge,
  Input,
  Label,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { formatErrorMessage, errorToastManager } from "helpers/error-helper";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  vendorsList,
  toggleVendorStateQuery,
  deleteVendorMutation,
} from "slices/thunks";
import { useTranslation } from "react-i18next";
import { imgURL } from "services/api-handles";
import DeleteConfirmationModal from "./vendors-modals/delete-confirmation-modal";

// Custom styles for vendor cards
const vendorCardStyles = `
  .vendor-card {
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .vendor-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .vendor-card .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
  }
  
  .vendor-card .card-header .card-title {
    color: white;
    font-weight: 600;
  }
  
  .status-badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
  }
  
  .vendor-card .card-footer {
    border-top: 1px solid #e9ecef;
    padding: 0.75rem 1rem;
  }
  
  .vendor-card .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .vendor-card .btn-sm:hover {
    transform: scale(1.05);
  }
  
  .vendor-card .form-switch {
    margin-bottom: 0;
  }
  
  .vendor-card .form-check-input {
    cursor: pointer;
  }
  
  .vendor-card .form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
  }

  .vendor-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    border-radius: 50%;
  }
`;

const VendorsList = () => {
  const { i18n, t } = useTranslation();
  const dispatch: any = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [vendorState, setVendorState] = useState<{
    currentState: null | boolean;
    vendorId: null | string | number;
  }>({
    currentState: null,
    vendorId: null,
  });
  // State for delete confirmation modal
  const [
    delete_confirmation_modal_standard,
    setDeleteConfirmationModalStandard,
  ] = useState<boolean>(false);
  const [vendorToDelete, setVendorToDelete] = useState<any>(null);

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random background color for initials
  const getRandomColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
      "#F1948A",
      "#85C1E9",
      "#D7BDE2",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Share vendor location function
  const shareVendorLocation = (
    lat: number,
    lng: number,
    vendorName: string
  ) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(googleMapsUrl)
      .then(() => {
        toast.success(
          `${t("Location for")} ${vendorName} ${t("copied to clipboard!")}`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error(t("Failed to copy location to clipboard"), {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  // Toggle vendor working status
  const toggleVendorStatus = (vendorId: string, currentStatus: boolean) => {
    dispatch(toggleVendorStateQuery(vendorId));
    setVendorState({
      vendorId,
      currentState: !currentStatus,
    });
    toast.success(t("Vendor status updated successfully!"), {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Toggle delete confirmation modal
  const tog_deleteConfirmationModal = () => {
    setDeleteConfirmationModalStandard(!delete_confirmation_modal_standard);
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (vendor: any) => {
    setVendorToDelete(vendor);
    tog_deleteConfirmationModal();
  };

  // Confirm delete vendor
  const confirmDeleteVendor = () => {
    if (vendorToDelete) {
      dispatch(deleteVendorMutation(vendorToDelete.vendorId));

      toast.success(
        `${t("Vendors")} ${
          i18n.dir() === "ltr"
            ? vendorToDelete.fullName
            : vendorToDelete.arFullName
        } ${t("deleted successfully!")}`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );

      setVendorToDelete(null);
    }
  };

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    error: state.error,
    success: state.success,
    vendorsListError: state.vendorsListError,
    vendorsListSuccess: state.vendorsListSuccess,
  }));
  // Inside your component
  const { error, vendorsListError, vendorsListSuccess } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    dispatch(vendorsList());
  }, [dispatch]);

  React.useEffect(() => {
    if (error) {
      console.log("error: ", vendorsListError);
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(vendorsListError, toast.error);
      setVendorState({
        currentState: null,
        vendorId: null,
      });
    }
    if (vendorsListSuccess) {
      console.log("vendorsListSuccess: ", vendorsListSuccess);
    }
  }, [error, vendorsListError, vendorsListSuccess]);

  const filteredVendors = React.useMemo(() => {
    const list = vendorsListSuccess?.list || [];
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter((item: any) => {
      const name =
        (i18n.dir() === "ltr" ? item.fullName : item.arFullName) || "";
      return name.toLowerCase().includes(term);
    });
  }, [vendorsListSuccess, searchTerm, i18n]);

  return (
    <React.Fragment>
      <style>{vendorCardStyles}</style>
      <ToastContainer />
      <Row className="mb-3">
        <Col xl={12}>
          <div className="d-flex align-items-center gap-2">
            <Label htmlFor="vendor-search" className="form-label mb-0">
              {t("Search:")}
            </Label>
            <Input
              id="vendor-search"
              type="text"
              placeholder={t("Search by name")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: 320 }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        {filteredVendors?.map((item: any) => (
          <Col md={6} lg={4} key={item.vendorId}>
            <Card className="vendor-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h6 className="card-title mb-0">{t("Vendor Card")}</h6>
                <div className="d-flex align-items-center gap-2">
                  {/* Status Badge */}
                  <Badge
                    color={item.working ? "success" : "secondary"}
                    className="status-badge"
                  >
                    {item.working ? t("Active") : t("Inactive")}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody className="p-4 text-center">
                <Link to={`${item.vendorId}`} state={item}>
                  <div className="mx-auto avatar-md mb-3">
                    {item.profileImage ? (
                      <img
                        src={imgURL + "/" + item.profileImage}
                        alt=""
                        className="rounded-circle"
                        loading="lazy"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="img-fluid rounded-circle vendor-initials"
                        style={{
                          backgroundColor: getRandomColor(
                            i18n.dir() === "ltr"
                              ? item.fullName
                              : item.arFullName
                          ),
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        {getInitials(
                          i18n.dir() === "ltr" ? item.fullName : item.arFullName
                        )}
                      </div>
                    )}
                  </div>
                  <h5 className="card-title mb-1">
                    {i18n.dir() === "ltr" ? item.fullName : item.arFullName}
                  </h5>
                  <p className="text-muted mb-0">{item.vendorType ?? "---"}</p>
                </Link>
              </CardBody>
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Status Toggle Switch */}
                  <div className="d-flex align-items-center gap-2">
                    <Label className="form-check-label mb-0 small">
                      {t("Status:")}
                    </Label>
                    <div className="form-check form-switch">
                      <Input
                        className="form-check-input"
                        type="switch"
                        id={`status-${item.vendorId}`}
                        checked={
                          vendorState?.vendorId === item.vendorId
                            ? vendorState?.currentState
                            : item.working
                        }
                        onChange={() =>
                          toggleVendorStatus(item.vendorId, item.working)
                        }
                      />
                    </div>
                  </div>

                  {/* Control Panel Icons */}
                  <div className="d-flex gap-2">
                    {/* Share Location */}
                    <button
                      className="btn btn-sm btn-primary"
                      title={t("Share vendor location")}
                      onClick={() =>
                        shareVendorLocation(
                          item.lat || 0,
                          item.lng || 0,
                          i18n.dir() === "ltr" ? item.fullName : item.arFullName
                        )
                      }
                    >
                      <i className="las la-map-marker-alt"></i>
                    </button>

                    {/* View Details */}
                    <Link
                      to={`${item.vendorId}`}
                      className="btn btn-sm btn-info"
                      title={t("View details")}
                    >
                      <i className="las la-eye"></i>
                    </Link>

                    {/* Delete Vendor */}
                    <button
                      className="btn btn-sm btn-danger"
                      title={t("Delete vendor")}
                      onClick={() => showDeleteConfirmation(item)}
                    >
                      <i className="las la-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
        {filteredVendors?.length === 0 && (
          <Col xl={12}>
            <div className="text-center text-muted py-5">
              {t("No vendors found.")}
            </div>
          </Col>
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        modal_standard={delete_confirmation_modal_standard}
        tog_standard={tog_deleteConfirmationModal}
        onConfirm={confirmDeleteVendor}
        vendorId={vendorToDelete?.vendorId}
        vendorName={
          vendorToDelete
            ? i18n.dir() === "ltr"
              ? vendorToDelete.fullName
              : vendorToDelete.arFullName
            : ""
        }
      />
    </React.Fragment>
  );
};

export default VendorsList;
