import React from "react";
import { Link } from "react-router-dom";
import { Col, Form, Input, Label, Row } from "reactstrap";

const ChangePasswordTab: React.FC = () => {
  return (
    <>
      <Form>
        <Row className="g-2">
          <Col lg={4}>
            <div>
              <Label htmlFor="oldpasswordInput" className="form-label">
                Old Password*
              </Label>
              <Input
                type="password"
                className="form-control"
                id="oldpasswordInput"
                placeholder="Enter current password"
              />
            </div>
          </Col>

          <Col lg={4}>
            <div>
              <Label htmlFor="newpasswordInput" className="form-label">
                New Password*
              </Label>
              <Input
                type="password"
                className="form-control"
                id="newpasswordInput"
                placeholder="Enter new password"
              />
            </div>
          </Col>

          <Col lg={4}>
            <div>
              <Label htmlFor="confirmpasswordInput" className="form-label">
                Confirm Password*
              </Label>
              <Input
                type="password"
                className="form-control"
                id="confirmpasswordInput"
                placeholder="Confirm password"
              />
            </div>
          </Col>

          <Col lg={12}>
            <div className="mb-3">
              <Link to="#" className="link-primary text-decoration-underline">
                Forgot Password ?
              </Link>
            </div>
          </Col>

          <Col lg={12}>
            <div className="text-end">
              <button type="button" className="btn btn-success">
                Change Password
              </button>
            </div>
          </Col>
        </Row>
      </Form>
      <div className="mt-4 mb-3 border-bottom pb-2">
        <div className="float-end">
          <Link to="#" className="link-primary">
            All Logout
          </Link>
        </div>
        <h5 className="card-title">Login History</h5>
      </div>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-shrink-0 avatar-sm">
          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
            <i className="ri-smartphone-line"></i>
          </div>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6>iPhone 12 Pro</h6>
          <p className="text-muted mb-0">
            Los Angeles, United States - March 16 at 2:47PM
          </p>
        </div>
        <div>
          <Link to="#">Logout</Link>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-shrink-0 avatar-sm">
          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
            <i className="ri-tablet-line"></i>
          </div>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6>Apple iPad Pro</h6>
          <p className="text-muted mb-0">
            Washington, United States - November 06 at 10:43AM
          </p>
        </div>
        <div>
          <Link to="#">Logout</Link>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-shrink-0 avatar-sm">
          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
            <i className="ri-smartphone-line"></i>
          </div>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6>Galaxy S21 Ultra 5G</h6>
          <p className="text-muted mb-0">
            Conneticut, United States - June 12 at 3:24PM
          </p>
        </div>
        <div>
          <Link to="#">Logout</Link>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 avatar-sm">
          <div className="avatar-title bg-light text-primary rounded-3 fs-18 material-shadow">
            <i className="ri-macbook-line"></i>
          </div>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6>Dell Inspiron 14</h6>
          <p className="text-muted mb-0">
            Phoenix, United States - July 26 at 8:10AM
          </p>
        </div>
        <div>
          <Link to="#">Logout</Link>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordTab;
