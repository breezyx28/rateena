import React, { useState } from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { Button } from "reactstrap";
import { VendorUsersList } from "./vendor-users-list";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useParams } from "react-router-dom";
import {
  addVendorUserMutation,
  updateVendorUserMutation,
  deleteVendorUserMutation,
  getVendorUsers,
} from "slices/thunks";
import { clearVendorSuccess } from "slices/vendors/reducer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { errorToastManager } from "helpers/error-helper";
import { useTranslation } from "react-i18next";

const VendorUsers = () => {
  const { t } = useTranslation();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendorUsersData, setVendorUsersData] = useState<any[]>([]);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [modal_update, setmodal_update] = useState<boolean>(false);
  const [modal_delete, setmodal_delete] = useState<boolean>(false);
  const [currentVendorUser, setCurrentVendorUser] = useState<Record<any, any>>(
    {}
  );
  const [vendorUserId, setVendorUserId] = useState<any>(null);
  const [deleteVendorUserId, setDeleteVendorUserId] = useState<any>(null);
  const [deletedUser, setDeletedUser] = useState<any>(null);

  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  function tog_update() {
    setmodal_update(!modal_update);
  }

  function tog_delete() {
    setmodal_delete(!modal_delete);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorUsers: state.vendorUsers,
    vendorUserAddedSuccess: state.vendorUserAddedSuccess,
    error: state.error,
  }));
  // Inside your component
  const { vendorError, vendorUsers, error, vendorUserAddedSuccess } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (vendorId) {
      dispatch(getVendorUsers(vendorId));
    }
  }, [vendorId]);

  React.useEffect(() => {
    if (vendorUsers?.list) {
      console.log("vendorUsers: ", vendorUsers.list);
      setVendorUsersData(vendorUsers?.list);
    }
  }, [vendorUsers]);

  React.useEffect(() => {
    if (vendorError?.message || vendorError?.error) {
      console.log("vendorError: ", vendorError);
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(vendorError, toast.error);

      // If there was a deleted user and an error occurred, restore the user
      if (deletedUser) {
        setVendorUsersData((prevData) => [...prevData, deletedUser]);
        setDeletedUser(null);
        // Show specific delete failure toast
        toast.error(t("Failed to delete vendor user. Please try again."), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [vendorError, deletedUser]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      phone: Yup.string().required("Please Enter Your Phone Number"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);

      dispatch(addVendorUserMutation(values, vendorId));
    },
  });

  const handleDelete = (userId: number) => {
    // Find the user to be deleted
    const userToDelete = vendorUsersData.find((user) => user.userId === userId);
    if (userToDelete) {
      // Store the deleted user for potential restoration
      setDeletedUser(userToDelete);
      // Optimistically remove the user from the list
      setVendorUsersData((prevData) =>
        prevData.filter((user) => user.userId !== userId)
      );
    }
    dispatch(deleteVendorUserMutation(userId, vendorId));
  };

  const updateValidation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      userId: currentVendorUser?.userId ?? "",
      email: currentVendorUser?.email ?? "",
      phone: currentVendorUser?.phone ?? "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Please enter a valid email").optional(),
      phone: Yup.string().optional(),
      password: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      console.log("update-form-values: ", values);

      dispatch(updateVendorUserMutation(values, vendorId));
    },
  });

  // Handle success state after formik validations are declared
  React.useEffect(() => {
    if (vendorUserAddedSuccess) {
      console.log("vendorUserAddedSuccess: ", vendorUserAddedSuccess);
      // Only close the add modal if it's open
      if (modal_standard) {
        tog_standard();
      }
      // Only close the update modal if it's open
      if (modal_update) {
        tog_update();
      }
      // Reset form after success
      validation.resetForm();
      updateValidation.resetForm();

      // Clear the deleted user state on successful operation
      if (deletedUser) {
        setDeletedUser(null);
        // Show delete success toast
        toast.success(t("Vendor user deleted successfully!"), {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Clear the success state after handling it
      setTimeout(() => {
        dispatch(clearVendorSuccess());
      }, 100);
    }
  }, [
    vendorUserAddedSuccess,
    modal_standard,
    modal_update,
    validation,
    updateValidation,
    dispatch,
    deletedUser,
  ]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="w-full d-flex justify-content-end">
            <Button color="primary" onClick={() => tog_standard()}>
              {t("Add User")}
            </Button>
          </div>
          <VendorUsersList
            data={vendorUsersData}
            onEditUser={(user) => {
              setCurrentVendorUser(user);
              setVendorUserId(user.userId);
              tog_update();
            }}
            onDeleteUser={(userId) => {
              setDeleteVendorUserId(userId);
              tog_delete();
            }}
          />
        </Col>
      </Row>

      {/* Add User Modal */}
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
          {t("Add User")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            id="add-vendor-user-form"
          >
            {vendorUserAddedSuccess && !vendorError?.message ? (
              <>
                <Alert color="success">{t("Vendor User Successfully Added")}</Alert>
              </>
            ) : null}
            {vendorError && !vendorUserAddedSuccess ? (
              <Alert color="danger">
                {String(vendorError?.message || vendorError)}
              </Alert>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="phone" className="form-label">
                    {t("Phone")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.phone || ""}
                    invalid={
                      validation.touched.phone && validation.errors.phone
                        ? true
                        : false
                    }
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <FormFeedback type="invalid">
                      <div>{String(validation.errors.phone)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="email" className="form-label">
                    {t("Email")}
                  </Label>
                  <div className="form-icon">
                    <Input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={
                        validation.touched.email && validation.errors.email
                          ? true
                          : false
                      }
                    />
                    {validation.touched.email && validation.errors.email ? (
                      <FormFeedback type="invalid">
                        <div>{String(validation.errors.email)}</div>
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="password" className="form-label">
                    {t("Password")}
                  </Label>
                  <Input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password || ""}
                    invalid={
                      validation.touched.password && validation.errors.password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <FormFeedback type="invalid">
                      <div>{String(validation.errors.password)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="add-vendor-user-btn"
              style={{
                visibility: "hidden",
              }}
            >
              Submit
            </Button>
          </Form>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_standard();
            }}
          >
            {t("Close")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("add-vendor-user-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>

      {/* Update User Modal */}
      <Modal
        id="updateModal"
        isOpen={modal_update}
        toggle={() => {
          tog_update();
        }}
      >
        <ModalHeader
          className="modal-title"
          id="updateModalLabel"
          toggle={() => {
            tog_update();
          }}
        >
          {t("Update User")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              updateValidation.handleSubmit();
              return false;
            }}
            id="update-vendor-user-form"
          >
            {vendorUserAddedSuccess && !vendorError?.message ? (
              <>
                <Alert color="success">{t("Vendor User Successfully Updated")}</Alert>
              </>
            ) : null}
            {vendorError && !vendorUserAddedSuccess ? (
              <Alert color="danger">
                {String(vendorError?.message || vendorError)}
              </Alert>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
                <div>
                  <Input
                    type="hidden"
                    className="form-control"
                    id="userId"
                    name="userId"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.userId || ""}
                    invalid={
                      updateValidation.touched.userId &&
                      updateValidation.errors.userId
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updatePhone" className="form-label">
                    {t("Phone")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="updatePhone"
                    name="phone"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.phone || ""}
                    invalid={
                      updateValidation.touched.phone &&
                      updateValidation.errors.phone
                        ? true
                        : false
                    }
                  />
                  {updateValidation.touched.phone &&
                  updateValidation.errors.phone ? (
                    <FormFeedback type="invalid">
                      <div>{String(updateValidation.errors.phone)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updateEmail" className="form-label">
                    {t("Email")}
                  </Label>
                  <div className="form-icon">
                    <Input
                      type="email"
                      className="form-control"
                      id="updateEmail"
                      name="email"
                      onChange={updateValidation.handleChange}
                      onBlur={updateValidation.handleBlur}
                      value={updateValidation.values.email || ""}
                      invalid={
                        updateValidation.touched.email &&
                        updateValidation.errors.email
                          ? true
                          : false
                      }
                    />
                    {updateValidation.touched.email &&
                    updateValidation.errors.email ? (
                      <FormFeedback type="invalid">
                        <div>{String(updateValidation.errors.email)}</div>
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updatePassword" className="form-label">
                    {t("Password")}
                  </Label>
                  <Input
                    type="password"
                    className="form-control"
                    id="updatePassword"
                    name="password"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.password || ""}
                    invalid={
                      updateValidation.touched.password &&
                      updateValidation.errors.password
                        ? true
                        : false
                    }
                  />
                  {updateValidation.touched.password &&
                  updateValidation.errors.password ? (
                    <FormFeedback type="invalid">
                      <div>{String(updateValidation.errors.password)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="update-vendor-user-btn"
              style={{
                visibility: "hidden",
              }}
            >
              Submit
            </Button>
          </Form>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_update();
            }}
          >
            {t("Close")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("update-vendor-user-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
      >
        <ModalHeader
          className="modal-title"
          toggle={() => {
            tog_delete();
          }}
        >
          {t("Confirm Delete")}
        </ModalHeader>
        <ModalBody>
          <p>
            {t("Are you sure you want to delete this vendor user? This action cannot be undone.")}
          </p>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_delete();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            color="danger"
            onClick={() => {
              handleDelete(deleteVendorUserId);
              tog_delete();
            }}
          >
            {t("Delete")}
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default VendorUsers;
