import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

const DeleteConfirmationModal = ({
  modal_standard,
  tog_standard,
  onConfirm,
  productName,
}: {
  modal_standard: boolean;
  tog_standard: () => void;
  onConfirm: () => void;
  productName: string;
}) => {
  return (
    <Modal isOpen={modal_standard} toggle={tog_standard} centered>
      <ModalHeader toggle={tog_standard}>Confirm Delete</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <div className="mb-3">
            <i className="ri-delete-bin-line display-4 text-danger"></i>
          </div>
          <h5 className="mb-3">Are you sure?</h5>
          <p className="text-muted">
            Do you want to delete the product "{productName}"? This action cannot be undone.
          </p>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button color="light" onClick={tog_standard}>
            Cancel
          </Button>
          <Button color="danger" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmationModal;