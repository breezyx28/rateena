import React from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";

const Widgets = ({ details }: { details: any }) => {
  const suffixTag = (item: number) =>
    item > 999 && item < 1000000 ? "K" : item > 99999 ? "M" : "";

  const inProcessOrders =
    details?.orders?.filter(
      (item: any) => item.status === "WAITING" || item.status === "PROCESSING"
    )?.length ?? 0;

  const ecomWidgets = [
    {
      id: 1,
      cardColor: "primary",
      label: "Company Profit",
      badge: "ri-arrow-right-up-line",
      badgeClass: "success",
      percentage: details?.companyProfit?.change ?? "+0.00 %",
      counter: details?.companyProfit?.value ?? 0,
      link: "View net earnings",
      bgcolor: "success",
      icon: "bx bx-dollar-circle",
      decimals: 2,
      prefix: "$",
      suffix: suffixTag(details?.companyProfit?.value ?? 0),
    },
    {
      id: 2,
      cardColor: "secondary",
      label: "Total Revenue",
      badge: "ri-arrow-right-down-line",
      badgeClass: "danger",
      percentage: details?.totalRevenue?.change ?? "+0.00%",
      counter: details?.totalRevenue?.value ?? 0,
      link: "View all orders",
      bgcolor: "info",
      icon: "bx bx-shopping-bag",
      decimals: 0,
      prefix: "$",
      separator: ",",
      suffix: "",
    },
    {
      id: 3,
      cardColor: "success",
      label: "New Customers",
      badge: "ri-arrow-right-up-line",
      badgeClass: "success",
      percentage: details?.newCustomers?.change ?? "+0.00%",
      counter: details?.newCustomers?.value ?? 0,
      link: "See details",
      bgcolor: "warning",
      icon: "bx bx-user-circle",
      decimals: 2,
      prefix: "",
      suffix: suffixTag(details?.newCustomers?.value ?? 0),
    },
    {
      id: 4,
      cardColor: "info",
      label: "In Process Orders",
      badgeClass: "muted",
      percentage: details?.inProcessOrders?.change ?? "+0.00%",
      counter: details?.inProcessOrders?.value ?? 0,
      link: "Withdraw money",
      bgcolor: "primary",
      icon: "bx bx-wallet",
      decimals: 0,
      prefix: "",
      suffix: suffixTag(details?.inProcessOrders?.value),
    },
  ];
  return (
    <React.Fragment>
      {ecomWidgets.map((item, key) => (
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
                  <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                    {item.badge ? (
                      <i className={"fs-13 align-middle " + item.badge}></i>
                    ) : null}{" "}
                    {item.percentage}
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
                        separator={item.separator}
                        end={item.counter}
                        decimals={item.decimals}
                        duration={4}
                      />
                    </span>
                  </h4>
                  <Link to="#" className="text-decoration-underline">
                    {item.link}
                  </Link>
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

export default Widgets;
