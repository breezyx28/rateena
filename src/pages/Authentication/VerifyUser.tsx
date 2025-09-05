import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useTranslation } from "react-i18next";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import images
import logoLight from "../../assets/images/Logo.png";
import {
  forgotPasswordSessionData,
  userVerifyOtp,
} from "slices/auth/verifyOtp/thunk";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

const VerifyUser = () => {
  const { t } = useTranslation();
  const [OTP, setOTP] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const location = useLocation();
  const forgotdata = location.state;

  const dispatch: any = useDispatch();

  document.title = `${t("OTP Verification")} | Rateena - E-Shop Admin Panel`;

  const getInputElement = (index: number): HTMLInputElement => {
    return document.getElementById(
      "digit" + index + "-input"
    ) as HTMLInputElement;
  };
  const moveToNext = (index: any) => {
    if (getInputElement(index).value.length === 1) {
      // save otp to state
      setOTP(OTP + getInputElement(index).value.toString());
      if (index !== 4) {
        getInputElement(index + 1).focus();
      } else {
        getInputElement(index).blur();
        // Set OTP
        setOTP(OTP + getInputElement(index).value.toString());
        // Submit code
        document.getElementById("verify-otp-btn")?.click();
      }
    }
  };

  const handleOTPverification = async (e: any) => {
    e.preventDefault();

    try {
      dispatch(userVerifyOtp({ OTP }));
      setLoading(true);
    } catch (error) {
      setLoading(false);
    }
  };

  const selectLayoutState = (state: any) => state.VerifyOtp;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    error: state.error,
    success: state.success,
    loading: state.loading,
    verifyOtpError: state.verifyOtpError,
    verifyOtpSuccessMsg: state.verifyOtpSuccessMsg,
  }));
  // Inside your component
  const {
    verifyOtpError,
    verifyOtpSuccessMsg,
    error,
    success,
    loading: isLoading,
  } = useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (error) {
      console.log("error: ", verifyOtpError);
    }
  }, [error, verifyOtpError]);

  return (
    <React.Fragment>
      <div className="auth-page-wrapper">
        <ParticlesAuth>
          <div className="auth-page-content">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="text-center mt-sm-5 mb-4 text-white-50">
                    <div>
                      <Link
                        to="/dashboard"
                        className="d-inline-block auth-logo"
                      >
                        <img src={logoLight} alt="" height="20" />
                      </Link>
                    </div>
                    <p className="mt-3 fs-15 fw-medium">
                      {t("Enter OTP that send to your phone number")}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5}>
                  <Card className="mt-4 card-bg-fill">
                    <CardBody className="p-4">
                      <div className="mb-4">
                        <div className="avatar-lg mx-auto">
                          <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                            <i className="ri-mail-line"></i>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 mt-4">
                        <div className="text-muted text-center mb-4 mx-lg-3">
                          <h4 className="">{t("Verify Your Account")}</h4>
                          <p>
                            {t("Please enter the 6 digit code sent to")}{" "}
                            <span className="fw-semibold">
                              {forgotPasswordSessionData?.phone
                                ? forgotPasswordSessionData.phone
                                : forgotdata ?? "---"}
                            </span>
                          </p>
                        </div>

                        <form onSubmit={handleOTPverification}>
                          {error && error ? (
                            <>
                              {toast(t("Some errors happened"), {
                                position: "top-right",
                                hideProgressBar: false,
                                className: "bg-error text-white",
                                progress: undefined,
                                toastId: "",
                              })}
                              <ToastContainer autoClose={2000} limit={1} />
                              <Alert color="error">{t("Some errors happened")}</Alert>
                            </>
                          ) : null}
                          <Row>
                            <Col className="col-3">
                              <div className="mb-3">
                                <label
                                  htmlFor="digit1-input"
                                  className="visually-hidden"
                                >
                                  {t("Digit 1")}
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg bg-light border-light text-center"
                                  maxLength={1}
                                  id="digit1-input"
                                  onKeyUp={() => moveToNext(1)}
                                />
                              </div>
                            </Col>

                            <Col className="col-3">
                              <div className="mb-3">
                                <label
                                  htmlFor="digit2-input"
                                  className="visually-hidden"
                                >
                                  {t("Digit 2")}
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg bg-light border-light text-center"
                                  maxLength={1}
                                  id="digit2-input"
                                  onKeyUp={() => moveToNext(2)}
                                />
                              </div>
                            </Col>

                            <Col className="col-3">
                              <div className="mb-3">
                                <label
                                  htmlFor="digit3-input"
                                  className="visually-hidden"
                                >
                                  {t("Digit 3")}
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg bg-light border-light text-center"
                                  maxLength={1}
                                  id="digit3-input"
                                  onKeyUp={() => moveToNext(3)}
                                />
                              </div>
                            </Col>

                            <Col className="col-3">
                              <div className="mb-3">
                                <label
                                  htmlFor="digit4-input"
                                  className="visually-hidden"
                                >
                                  {t("Digit 4")}
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg bg-light border-light text-center"
                                  maxLength={1}
                                  id="digit4-input"
                                  onKeyUp={() => moveToNext(4)}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div className="mt-3">
                            <Button
                              id="verify-otp-btn"
                              color="success"
                              type="submit"
                              className="w-100"
                              disabled={loading}
                            >
                              {loading && (
                                <Spinner size="sm" className="me-2">
                                  {" "}
                                  {t("Loading...")}{" "}
                                </Spinner>
                              )}
                              {t("Confirm")}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="mt-4 text-center">
                    <p className="mb-0">
                      {t("Didn't receive a code ?")}{" "}
                      <Link
                        to="/auth-pass-reset-basic"
                        className="fw-semibold text-primary text-decoration-underline"
                      >
                        {t("Resend")}
                      </Link>{" "}
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </ParticlesAuth>
      </div>
    </React.Fragment>
  );
};

export default VerifyUser;
