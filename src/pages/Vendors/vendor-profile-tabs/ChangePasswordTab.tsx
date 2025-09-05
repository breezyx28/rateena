import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  resetUserPassword,
  resetRestPasswordFlag,
  resetAdminUserPasswordMutation,
} from "../../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { FormikErrorProvider } from "../../../contexts/FormikErrorContext";

const ChangePasswordTab: React.FC<any> = ({
  vendorInfo,
}: {
  vendorInfo: any;
}) => {
  const { t } = useTranslation();
  const dispatch: any = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: vendorInfo?.userPhone || "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Please Enter Phone Number"),
      new_password: Yup.string().required("Please Enter Your New Password"),
      new_password_confirmation: Yup.string()
        .oneOf([Yup.ref("new_password"), ""])
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(resetAdminUserPasswordMutation(values));
      setLoader(true);
    },
  });

  const selectLayoutState = (state: any) => state.AdminUsers;
  const resetpassworddatatype = createSelector(
    selectLayoutState,
    (resetPasswordState) => ({
      adminUserUpdated: resetPasswordState.adminUserUpdated,
      error: resetPasswordState.error,
      adminUserError: resetPasswordState.adminUserError,
    })
  );

  const { error, adminUserUpdated, adminUserError } = useSelector(
    resetpassworddatatype
  );

  useEffect(() => {
    if (adminUserUpdated) {
      toast.success(t("Password changed successfully!"), {
        position: "top-right",
        autoClose: 2000,
      });
      validation.resetForm();
      setLoader(false);
    }

    if (adminUserError) {
      setLoader(false);
    }

    setTimeout(() => {
      dispatch(resetRestPasswordFlag());
    }, 3000);
  }, [dispatch, adminUserUpdated, error, adminUserError]);

  return (
    <FormikErrorProvider formik={validation} serverError={adminUserError}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        {adminUserUpdated && !adminUserError && (
          <Col lg={12}>
            <Alert color="success">{t("Password changed successfully!")}</Alert>
          </Col>
        )}
        {adminUserError && !adminUserUpdated && (
          <Col lg={12}>
            <Alert color="danger">{adminUserError?.message}</Alert>
          </Col>
        )}
        <Row className="g-2">
          <Col lg={4}>
            <div>
              <Label htmlFor="phoneInput" className="form-label">
                {t("Phone Number*")}
              </Label>
              <Input
                type="text"
                className="form-control"
                id="phoneInput"
                name="phone"
                placeholder={t("Enter phone number")}
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

          <Col lg={4}>
            <div>
              <Label htmlFor="newpasswordInput" className="form-label">
                {t("New Password*")}
              </Label>
              <Input
                type="password"
                className="form-control"
                id="newpasswordInput"
                name="new_password"
                placeholder={t("Enter new password")}
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
              {validation.touched.new_password &&
              validation.errors.new_password ? (
                <FormFeedback type="invalid">
                  <div>{validation.errors.new_password}</div>
                </FormFeedback>
              ) : null}
            </div>
          </Col>

          <Col lg={4}>
            <div>
              <Label htmlFor="confirmpasswordInput" className="form-label">
                {t("Confirm Password*")}
              </Label>
              <Input
                type="password"
                className="form-control"
                id="confirmpasswordInput"
                name="new_password_confirmation"
                placeholder={t("Confirm password")}
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
              {validation.touched.new_password_confirmation &&
              validation.errors.new_password_confirmation ? (
                <FormFeedback type="invalid">
                  <div>{validation.errors.new_password_confirmation}</div>
                </FormFeedback>
              ) : null}
            </div>
          </Col>

          <Col lg={12}>
            <div className="text-end">
              <Button color="success" type="submit" disabled={loader}>
                {loader && (
                  <Spinner size="sm" className="me-2">
                    {t("Loading...")}
                  </Spinner>
                )}
                {t("Change Password")}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </FormikErrorProvider>
  );
};

export default ChangePasswordTab;
