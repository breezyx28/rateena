import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const Alt401 = () => {
  document.title = "401 Unauthorized | Rateena - E-Shop Admin Panel";
  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col xl={5}>
                <Card className="overflow-hidden card-bg-fill galaxy-border-none">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <i className="ri-bard-line display-5 text-success"></i>
                      <h1 className="text-primary mb-4">Oops !</h1>
                      <h4 className="text-uppercase">
                        Sorry, You are not authorized to access this page 😭
                      </h4>
                      <p className="text-muted mb-4">
                        Please contact the administrator to get access to this
                        page!
                      </p>
                      <Link to="/dashboard" className="btn btn-success">
                        <i className="mdi mdi-home me-1"></i>Back to home
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Alt401;
