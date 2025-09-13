import React from "react";
import { Alert, Col, Form, Input, Label, Row } from "reactstrap";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { resetAdminUserPasswordMutation } from "slices/thunks";
import { useTranslation } from "react-i18next";

interface ResetPasswordModalProps {
  modal_standard: boolean;
  tog_standard: () => void;
  userId?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  modal_standard,
  tog_standard,
  userId,
}) => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.AdminUsers;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    resetPasswordError: state.resetPasswordError,
    resetPasswordSuccess: state.resetPasswordSuccess,
    error: state.error,
  }));

  const { resetPasswordError, resetPasswordSuccess, error } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (resetPasswordSuccess) {
      console.log("resetPasswordSuccess: ", resetPasswordSuccess);
    }
    if (resetPasswordError) {
      console.log("resetPasswordError: ", resetPasswordError);
    }
  }, [resetPasswordError, resetPasswordSuccess]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required(t("Please Enter Your Phone Number")),
      new_password: Yup.string().required(t("Please Enter Your New Password")),
      new_password_confirmation: Yup.string()
        .oneOf([Yup.ref("new_password")], t("Passwords must match"))
        .required(t("Please Confirm Your Password")),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);
      dispatch(resetAdminUserPasswordMutation(values));
    },
  });

  return (
    <React.Fragment>
      <Modal
        id="resetPasswordModal"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
      >
        <ModalHeader
          className="modal-title"
          id="resetPasswordModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          {t("Reset Password")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            id="reset-password-form"
          >
            {resetPasswordSuccess ? (
              <>
                {Swal.fire({
                  title: t("Password Reset Successfully!"),
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false
                })}
                <Alert color="success">{t("Password Reset Successfully!")}</Alert>
              </>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="phone" className="form-label">
                    {t("phone")}
                  </Label>
                  <Input
                    type="password"
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
                  <Label htmlFor="new_password" className="form-label">
                    {t("New Password")}
                  </Label>
                  <Input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="new_password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.new_password || ""}
                    invalid={
                      validation.touched.new_password &&
                      validation.errors.new_password
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label
                    htmlFor="new_password_confirmation"
                    className="form-label"
                  >
                    {t("Confirm Password")}
                  </Label>
                  <Input
                    type="password"
                    className="form-control"
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.new_password_confirmation || ""}
                    invalid={
                      validation.touched.new_password_confirmation &&
                      validation.errors.new_password_confirmation
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="reset-password-btn"
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
              document.getElementById("reset-password-btn")?.click();
            }}
          >
            {t("Reset Password")}
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ResetPasswordModal;
