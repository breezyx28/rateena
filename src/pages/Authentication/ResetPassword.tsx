import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { resetUserPassword, resetRestPasswordFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images
import logoLight from "../../assets/images/Logo.png";
// import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const forgotPassData = sessionStorage.getItem("forgot-password-data")
  ? JSON.parse(sessionStorage.getItem("forgot-password-data") ?? "")
  : {};

const ResetPassword = () => {
  const history = useNavigate();
  const dispatch: any = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: Yup.object({
      new_password: Yup.string().required("Please Enter Your New Password"),
      new_password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), ""])
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        resetUserPassword({ ...values, phone: forgotPassData.phone || "" })
      );
      setLoader(true);
    },
  });

  const selectLayoutState = (state: any) => state.ResetPassword;
  const resetpassworddatatype = createSelector(
    selectLayoutState,
    (resetPasswordState) => ({
      success: resetPasswordState.success,
      error: resetPasswordState.error,
      restPasswordError: resetPasswordState.restPasswordError,
    })
  );
  // Inside your component
  const { error, success, restPasswordError } = useSelector(
    resetpassworddatatype
  );

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    if (error) {
      console.log("error: ", restPasswordError);
    }

    setTimeout(() => {
      dispatch(resetRestPasswordFlag());
    }, 3000);
  }, [dispatch, success, error, restPasswordError, history]);

  document.title = "Reset Password | Rateena - E-Shop Admin Panel";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">
                    Premium Admin & Dashboard Template
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Reset Password</h5>
                      <p className="text-muted">
                        Type and Re-type your new password
                      </p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: "bg-success text-white",
                              progress: undefined,
                              toastId: "",
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Register User Successfully and Your Redirect To
                              Login Page...
                            </Alert>
                          </>
                        ) : null}

                        <div className="mb-3">
                          <Label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="new_password"
                            type="password"
                            placeholder="Enter Password"
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

                        <div className="mb-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="new_password_confirmation"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.new_password_confirmation || ""
                            }
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
                              <div>
                                {validation.errors.new_password_confirmation}
                              </div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            className="w-100"
                            type="submit"
                            disabled={loader && true}
                          >
                            {loader && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            )}
                            Sign Up
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    I remember my password now let's{" "}
                    <Link
                      to="/login"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Login{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default ResetPassword;
