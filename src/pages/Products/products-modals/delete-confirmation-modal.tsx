import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationModalProps {
  modal_standard: boolean;
  tog_standard: () => void;
  onConfirm: () => void;
  vendorId?: string;
  vendorName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  modal_standard,
  tog_standard,
  onConfirm,
  vendorId,
  vendorName,
}) => {
  const { t } = useTranslation();
  
  const handleConfirm = () => {
    onConfirm();
    tog_standard();
  };

  return (
    <React.Fragment>
      <Modal
        id="deleteVendorConfirmationModal"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
        centered
      >
        <ModalHeader
          className="modal-title"
          id="deleteVendorConfirmationModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          {t("Confirm Delete Vendor")}
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <div className="mb-4">
              <i
                className="las la-exclamation-triangle text-warning"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h5 className="mb-3">
              {t("Are you sure you want to delete this vendor?")}
            </h5>
            {vendorName && (
              <p className="text-muted mb-4">
                {t("Vendor:")}{" "}<strong>{vendorName}</strong> (ID: {vendorId})
              </p>
            )}
            <p className="text-muted">
              {t("This action cannot be undone. The vendor and all associated data will be permanently removed from the system.")}
            </p>
          </div>
        </ModalBody>
        <div className="modal-footer justify-content-center">
          <Button
            color="light"
            onClick={() => {
              tog_standard();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button color="danger" onClick={handleConfirm}>
            {t("Delete Vendor")}
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteConfirmationModal;
