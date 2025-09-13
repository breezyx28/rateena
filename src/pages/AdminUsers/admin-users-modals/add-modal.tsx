import React, { useState } from "react";
import { Alert, Col, Form, Input, Label, Row } from "reactstrap";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { addOrUpdateUserMutation } from "slices/thunks";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface AddModalProps {
  modal_standard: boolean;
  tog_standard: () => void;
  userId?: string;
}

const AddModal: React.FC<AddModalProps> = ({
  modal_standard,
  tog_standard,
  userId,
}) => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.AdminUsers;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    adminUsersError: state.adminUsersError,
    adminUserAdded: state.adminUserAdded,
    error: state.error,
  }));

  const { adminUsersError, error, adminUserAdded } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (adminUserAdded) {
      console.log("adminUserAdded: ", adminUserAdded);
    }
    if (adminUsersError) {
      console.log("adminUsersError: ", adminUsersError);
    }
  }, [adminUsersError, adminUserAdded]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("Please Enter Your Email")),
      phone: Yup.string().required(t("Please Enter Your Phone Number")),
      password: Yup.string().required(t("Please Enter Your Password")),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);
      dispatch(addOrUpdateUserMutation(values));
    },
  });

  return (
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
          {adminUserAdded ? (
            <>
              {Swal.fire({
                title: t("Your Redirect To Login Page..."),
                icon: "success",
                timer: 2000,
                showConfirmButton: false
              })}
              <Alert color="success">{t("Data Added Successfully")}</Alert>
            </>
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
  );
};

export default AddModal;
