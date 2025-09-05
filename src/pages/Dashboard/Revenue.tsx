import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

const Revenue = ({ details }: { details: any }) => {
  const { t } = useTranslation();

  const [countOrders, setCountOrders] = useState<number | string>(
    details?.revenue?.orders ?? 0
  );
  const [countEarnings, setCountEarnings] = useState<number | string>(
    details?.revenue?.earnings ?? 0
  );
  const [countCanceledOrders, setCountCanceledOrders] = useState<
    number | string
  >(details?.revenue?.canceledOrders ?? 0);

  const [chartData, setchartData] = useState<any>([]);

  React.useEffect(() => {
    if (details?.revenue?.orders) {
      setCountOrders(details?.revenue?.orders);
    }
    if (details?.revenue?.earnings) {
      setCountEarnings(details?.revenue?.earnings);
    }
    if (details?.revenue?.canceledOrders) {
      setCountCanceledOrders(details?.revenue?.canceledOrders);
    }
  }, [details.revenue]);

  // Transform monthly data to chart format
  const transformMonthlyDataToChartFormat = (monthlyData: any[]) => {
    if (!monthlyData || !Array.isArray(monthlyData)) {
      return [];
    }

    // Extract data arrays from monthly data
    const ordersData = monthlyData.map((item) => item.orders);
    const earningsData = monthlyData.map((item) => item.earnings);
    const refundsData = monthlyData.map((item) => item.refunds);

    return [
      {
        name: t("Orders"),
        type: "area",
        data: ordersData,
      },
      {
        name: t("Earnings"),
        type: "bar",
        data: earningsData,
      },
      {
        name: t("Refunds"),
        type: "line",
        data: refundsData,
      },
    ];
  };

  useEffect(() => {
    // Use the monthly data from details if available, otherwise fall back to revenueData
    const monthlyData = details?.revenue?.monthly;
    if (monthlyData) {
      const transformedData = transformMonthlyDataToChartFormat(monthlyData);

      setchartData(transformedData);
    } else {
      setchartData([
        {
          name: t("Orders"),
          type: "area",
          data: [],
        },
        {
          name: t("Earnings"),
          type: "bar",
          data: [],
        },
        {
          name: t("Refunds"),
          type: "line",
          data: [],
        },
      ]);
    }
  }, [details, t]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">{t("Revenue")}</h4>
          {/* <div className="d-flex gap-1">
            <button
              type="button"
              className="btn btn-soft-secondary btn-sm"
              onClick={() => {
                onChangeChartPeriod("all");
              }}
            >
              ALL
            </button>
            <button
              type="button"
              className="btn btn-soft-secondary btn-sm"
              onClick={() => {
                onChangeChartPeriod("month");
              }}
            >
              1M
            </button>
            <button
              type="button"
              className="btn btn-soft-secondary btn-sm"
              onClick={() => {
                onChangeChartPeriod("halfyear");
              }}
            >
              6M
            </button>
            <button
              type="button"
              className="btn btn-soft-primary btn-sm"
              onClick={() => {
                onChangeChartPeriod("year");
              }}
            >
              1Y
            </button>
          </div> */}
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    start={0}
                    end={countOrders as number}
                    duration={3}
                    separator=","
                  />
                </h5>
                <p className="text-muted mb-0">{t("Orders")}</p>
              </div>
            </Col>
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    suffix={""}
                    prefix="AED "
                    start={0}
                    decimals={2}
                    end={countEarnings as number}
                    duration={3}
                  />
                </h5>
                <p className="text-muted mb-0">{t("Earnings")}</p>
              </div>
            </Col>
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    start={0}
                    end={countCanceledOrders as number}
                    duration={3}
                  />
                </h5>
                <p className="text-muted mb-0">{t("Canceled Orders")}</p>
              </div>
            </Col>
            {/* <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0 border-end-0">
                <h5 className="mb-1 text-success">
                  <CountUp
                    start={0}
                    end={18.92}
                    decimals={2}
                    duration={3}
                    suffix="%"
                  />
                </h5>
                <p className="text-muted mb-0">Conversation Ratio</p>
              </div>
            </Col> */}
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts
                chartId="customer_impression_charts"
                series={chartData}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
