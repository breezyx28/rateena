import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, resetLoginFlag } from "../../slices/thunks";

// import logoLight from "../../assets/images/logo-light.png";
import logoLight from "../../assets/images/Logo.png";
import { createSelector } from "reselect";
import { setLoading } from "slices/auth/login/reducer";
import { useTranslation } from "react-i18next";
//import images

const Login = (props: any) => {
  const dispatch: any = useDispatch();
  const { t } = useTranslation();

  const selectLayoutState = (state: any) => state.Login;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.user,
    error: state.error,
    loading: state.loading,
    errorMsg: state.errorMsg,
  }));
  // Inside your component
  const { user, error, errorMsg, loading } = useSelector(loginpageData);

  const [userLogin, setUserLogin] = useState<any>([]);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (user && user) {
      const updatedUserData = user.phone;
      const updatedUserPassword = user.confirm_password;
      setUserLogin({
        phone: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      console.log("login-error:", error);
    }
  }, [error]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      phone: userLogin.phone,
      password: userLogin.password,
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Please Enter Your Phone Number"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
      setLoader(true);
    },
  });

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
        setLoader(false);
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  document.title = "Basic SignIn | Rateena - E-Shop Admin Panel";
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
                    {t("Premium Admin & Dashboard Template")}
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">{t("Welcome Back !")}</h5>
                      <p className="text-muted">
                        {t("Sign in to continue to Rateena.")}
                      </p>
                    </div>
                    {error?.message && error ? (
                      <Alert color="danger"> {error?.message} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="phone" className="form-label">
                            {t("Phone")}
                          </Label>
                          <Input
                            name="phone"
                            className="form-control"
                            placeholder={t("Enter phone")}
                            type="tel"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={
                              validation.touched.phone &&
                              validation.errors.phone
                                ? true
                                : false
                            }
                          />
                          {validation.touched.phone &&
                          validation.errors.phone ? (
                            <FormFeedback type="invalid">
                              {validation.errors.phone}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              {t("Forgot password?")}
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            {t("Password")}
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder={t("Enter Password")}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            {t("Remember me")}
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loading}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {loading && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                {t("Loading...")}{" "}
                              </Spinner>
                            )}
                            {t("Sign In")}
                          </Button>
                        </div>
                        {/* 
                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Sign In with</h5>
                          </div>
                        </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    {t("Don't have an account ?")}{" "}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      {t("Signup")}{" "}
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

export default withRouter(Login);
