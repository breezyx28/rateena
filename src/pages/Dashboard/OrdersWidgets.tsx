import React from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const OrdersWidgets = ({ details }: { details: any }) => {
  const { t } = useTranslation();

  const status = details.ordersByStatus;

  const ordersStatus = [
    {
      id: 1,
      cardColor: "info",
      label: t("Processing"),
      badge: null,
      badgeClass: null,
      percentage: null,
      counter: status?.processing?.count ?? 0,
      link: t("View net earnings"),
      bgcolor: "info",
      icon: "bx bx-loader-alt",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 2,
      cardColor: "warning",
      label: t("Waiting"),
      badge: null,
      badgeClass: null,
      percentage: null,
      counter: status?.waiting?.count ?? 0,
      link: t("View net earnings"),
      bgcolor: "warning",
      icon: "bx bx-time-five",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 3,
      cardColor: "success",
      label: t("Delivered"),
      badge: null,
      badgeClass: null,
      percentage: null,
      counter: status?.delivered?.count ?? 0,
      link: t("View net earnings"),
      bgcolor: "success",
      icon: "bx bx-check-circle",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 4,
      cardColor: "danger",
      label: t("Canceled"),
      badge: null,
      badgeClass: null,
      percentage: null,
      counter: status?.canceled?.count ?? 0,
      link: t("View net earnings"),
      bgcolor: "danger",
      icon: "bx bx-x-circle",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 5,
      cardColor: "success",
      label: t("Confirmed"),
      badge: null,
      badgeClass: null,
      percentage: null,
      counter: status?.confirmed?.count ?? 0,
      link: t("View net earnings"),
      bgcolor: "success",
      icon: "bx bx-check-double",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
  ];

  return (
    <React.Fragment>
      {ordersStatus?.map((item, key) => (
        <Col xl={3} md={6} key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    {item.label}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={"fs-14 mb-0 text-" + (item.badgeClass ?? "")}>
                    {item.badge ? (
                      <i className={"fs-13 align-middle " + item.badge}></i>
                    ) : null}{" "}
                    {item.percentage ?? ""}
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="559.25">
                      <CountUp
                        start={0}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        separator={""}
                        end={item.counter}
                        decimals={item.decimals}
                        duration={4}
                      />
                    </span>
                  </h4>
                  {/* <Link to="#" className="text-decoration-underline">
                    {item.link}
                  </Link> */}
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span
                    className={
                      "avatar-title rounded fs-3 bg-" + item.bgcolor + "-subtle"
                    }
                  >
                    <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default OrdersWidgets;
