import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

//import images
import progileBg from "../../assets/images/profile-bg.jpg";
import { imgURL } from "services/api-handles";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { useVendorState } from "../../hooks";
import {
  PersonalDetailsTab,
  ChangePasswordTab,
  ProductsTab,
  CategoriesTab,
  UsersTab,
} from "./vendor-profile-tabs";

const VendorProfile = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("1");

  // Use custom hook for vendor state management
  const {
    vendorInfo,
    selectedCoords,
    setSelectedCoords,
    toggleVendorStatus,
    handleProfileImageUpload,
    handleCoverImageUpload,
    getCurrentVendorStatus,
    getCurrentVendorStatusText,
  } = useVendorState({
    vendorId: vendorId || "",
    initialVendorInfo: location.state ?? {},
  });

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random background color for initials
  const getRandomColor = (name: string) => {
    if (!name) return "#6c757d"; // Default gray color if no name

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
      "#F1948A",
      "#85C1E9",
      "#D7BDE2",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  document.title = "Vendor Profile | Rateena - E-Shop Admin Panel";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img
                src={
                  vendorInfo?.profileImage
                    ? imgURL + "/" + vendorInfo?.coverImage
                    : progileBg
                }
                className="profile-wid-img"
                alt=""
              />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input
                      id="profile-foreground-img-file-input"
                      type="file"
                      className="profile-foreground-img-file-input"
                      onChange={handleCoverImageUpload}
                      accept="image/*"
                    />
                    <Label
                      htmlFor="profile-foreground-img-file-input"
                      className="profile-photo-edit btn btn-light"
                    >
                      <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                      Change Cover
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5 card-bg-fill">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      {vendorInfo?.profileImage ? (
                        <img
                          src={imgURL + "/" + vendorInfo?.profileImage}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                          alt="vendor-profile"
                        />
                      ) : (
                        <div
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: getRandomColor(
                              i18n.dir() === "ltr"
                                ? vendorInfo?.fullName || ""
                                : vendorInfo?.arFullName || ""
                            ),
                            color: "white",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            width: "80px",
                            height: "80px",
                          }}
                        >
                          {getInitials(
                            i18n.dir() === "ltr"
                              ? vendorInfo?.fullName || ""
                              : vendorInfo?.arFullName || ""
                          )}
                        </div>
                      )}
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                          onChange={handleProfileImageUpload}
                          accept="image/*"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">
                      {i18n.dir() === "ltr"
                        ? vendorInfo?.fullName
                        : vendorInfo?.arFullName}
                    </h5>
                    <p className="text-muted mb-0">{vendorInfo?.vendorType}</p>

                    {/* Vendor Status Toggle */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Label className="form-check-label mb-0 small">
                          Status:
                        </Label>
                        <div className="form-check form-switch">
                          <Input
                            className="form-check-input"
                            type="switch"
                            id={`vendor-status-${vendorId}`}
                            checked={getCurrentVendorStatus()}
                            onChange={() =>
                              toggleVendorStatus(
                                vendorId || "",
                                vendorInfo?.working || false
                              )
                            }
                          />
                        </div>
                        <small className="text-muted">
                          {getCurrentVendorStatusText()}
                        </small>
                      </div>
                    </div>

                    {/* Opening/Closing Times */}
                    {(vendorInfo?.fOpeningTime || vendorInfo?.fClosingTime) && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          {vendorInfo?.fOpeningTime && (
                            <div className="d-flex align-items-center gap-1">
                              <i className="las la-clock text-success"></i>
                              <small className="text-muted">
                                Opens: {vendorInfo.fOpeningTime}
                              </small>
                            </div>
                          )}
                          {vendorInfo?.fClosingTime && (
                            <div className="d-flex align-items-center gap-1">
                              <i className="las la-clock text-danger"></i>
                              <small className="text-muted">
                                Closes: {vendorInfo.fClosingTime}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5 card-bg-fill">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Personal Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Change Password
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          tabChange("3");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Products
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          tabChange("4");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Categories
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => {
                          tabChange("5");
                        }}
                        type="button"
                      >
                        <i className="far fa-envelope"></i>
                        Users
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <PersonalDetailsTab
                        vendorInfo={vendorInfo}
                        vendorId={vendorId || ""}
                        selectedCoords={selectedCoords}
                        setSelectedCoords={setSelectedCoords}
                      />
                    </TabPane>

                    <TabPane tabId="2">
                      <ChangePasswordTab />
                    </TabPane>

                    <TabPane tabId="3">
                      <ProductsTab />
                    </TabPane>

                    <TabPane tabId="4">
                      <CategoriesTab />
                    </TabPane>
                    <TabPane tabId="5">
                      <UsersTab />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorProfile;
