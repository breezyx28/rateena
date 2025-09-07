import React, { useState } from "react";
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

//import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import bell from "../../assets/images/svg/bell.svg";

//SimpleBar
import SimpleBar from "simplebar-react";
import { useNotificationsState } from "hooks/useNotificationsState";
import i18n from "i18n";

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const { notificationState, notificationInfo, toggleNotificationReadStatus } =
    useNotificationsState();

  //Dropdown Toggle
  const [isNotificationDropdown, setIsNotificationDropdown] =
    useState<boolean>(false);
  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab: any) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  console.log("notificationInfo: ", notificationInfo);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isNotificationDropdown}
        toggle={toggleNotificationDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle
          type="button"
          tag="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        >
          <i className="bx bx-bell fs-22"></i>
          <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
            {notificationState?.count}
            <span className="visually-hidden">{t("unread messages")}</span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="dropdown-head bg-primary bg-pattern rounded-top">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold text-white">
                    {t("Notifications")}
                  </h6>
                </Col>
                <div className="col-auto dropdown-tabs">
                  <span className="badge bg-light-subtle fs-13 text-body">
                    {notificationInfo?.length} {t("New")}
                  </span>
                </div>
              </Row>
            </div>

            <div className="px-2 pt-2">
              <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    {t("All")} ({notificationInfo?.length ?? 0})
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="py-2 ps-2">
              {notificationInfo?.length > 0 ? (
                notificationInfo?.map(({ notification: noti }: any) => (
                  <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                    <div className="text-reset notification-item d-block dropdown-item position-relative">
                      <div className="d-flex">
                        <div className="avatar-xs me-3">
                          <span className="avatar-title bg-info-subtle text-info rounded-circle fs-16">
                            <i className="bx bx-badge-check"></i>
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <Link
                            to={
                              noti?.resource === "product"
                                ? `/dashboard/vendors/${noti?.vendor_id}/product/${noti?.resource_id}`
                                : "#"
                            }
                            className="stretched-link"
                          >
                            <h6 className="mt-0 mb-2 lh-base">
                              {noti?.[i18n.language]}
                            </h6>
                          </Link>
                          {/* <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                            <span>
                              <i className="mdi mdi-clock-outline"></i>{" "}
                              {t("Just 30 sec ago")}
                            </span>
                          </p> */}
                        </div>
                        <div className="px-2 fs-15">
                          <div className="form-check notification-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="all-notification-check01"
                              onChange={() =>
                                toggleNotificationReadStatus(noti.id)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="all-notification-check01"
                            ></label>
                          </div>
                          {/* <input className="form-check-input" type="checkbox" /> */}
                        </div>
                      </div>
                    </div>

                    {/* <div className="my-3 text-center">
                      <button
                        type="button"
                        className="btn btn-soft-success waves-effect waves-light"
                      >
                        {t("View All Notifications")}{" "}
                        <i className="ri-arrow-right-line align-middle"></i>
                      </button>
                    </div> */}
                  </SimpleBar>
                ))
              ) : (
                <div>
                  <div className="w-25 w-sm-50 pt-3 mx-auto">
                    <img src={bell} className="img-fluid" alt="user-pic" />
                  </div>
                  <div className="text-center pb-5 mt-2">
                    <h6 className="fs-18 fw-semibold lh-base">
                      {t("Hey! You have no any notifications")}
                    </h6>
                  </div>
                </div>
              )}
            </TabPane>

            {/* <TabPane tabId="3" className="p-4">
              <div className="w-25 w-sm-50 pt-3 mx-auto">
                <img src={bell} className="img-fluid" alt="user-pic" />
              </div>
              <div className="text-center pb-5 mt-2">
                <h6 className="fs-18 fw-semibold lh-base">
                  Hey! You have no any notifications{" "}
                </h6>
              </div>
            </TabPane> */}
          </TabContent>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
