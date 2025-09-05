import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { recentOrders } from "../../common/data";
import { TOrderStatus } from "types";
import { imgURL } from "services/api-handles";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const RecentOrders = ({ details }: { details: any }) => {
  const { t } = useTranslation();

  const statusBadge = (status: TOrderStatus) => {
    switch (status) {
      case "WAITING":
        return "warning";
      case "CANCELED":
        return "danger";
      case "CONFIRMED":
        return "success";
      case "PROGRESSING":
        return "primary";
      case "PROCESSING":
        return "info";
      default:
        return "secondary";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  };

  const generateExcelReport = () => {
    const orders = details?.recentOrders || [];

    // Prepare data for Excel
    const excelData = orders.map((item: any) => ({
      [t("Order ID")]: item.order_number,
      [t("Customer Name")]: `${item.customer?.first_name || ""} ${
        item.customer?.last_name || ""
      }`.trim(),
      [t("Items Count")]: item.cart_items?.length || 0,
      [t("Total Amount")]: `$${item.total}`,
      [t("Vendor")]: item.vendor?.full_name || "",
      [t("Status")]: item.status,
      [t("Order Date")]: item.order_date
        ? new Date(item.order_date).toLocaleDateString()
        : "",
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Order ID
      { wch: 25 }, // Customer Name
      { wch: 12 }, // Items Count
      { wch: 15 }, // Total Amount
      { wch: 25 }, // Vendor
      { wch: 15 }, // Status
      { wch: 15 }, // Order Date
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      t("Recent Orders Report")
    );

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `recent_orders_report_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <React.Fragment>
      <Col xl={8}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              {t("Recent Orders")}
            </h4>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="btn btn-soft-info btn-sm"
                onClick={generateExcelReport}
              >
                <i className="ri-file-list-3-line align-middle"></i>{" "}
                {t("Generate Report")}
              </button>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th scope="col">{t("Order ID")}</th>
                    <th scope="col">{t("Customer")}</th>
                    <th scope="col">{t("Product")}</th>
                    <th scope="col">{t("Amount")}</th>
                    <th scope="col">{t("Vendor")}</th>
                    <th scope="col">{t("Status")}</th>
                    {/* <th scope="col">Rating</th> */}
                  </tr>
                </thead>
                <tbody>
                  {(details?.recentOrders || []).map(
                    (item: any, key: number) => (
                      <tr key={key}>
                        <td>
                          <Link
                            to="/apps-ecommerce-order-details"
                            className="fw-medium link-primary"
                          >
                            {item.order_number}
                          </Link>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-2">
                              <div className="avatar-xs rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-medium">
                                {getInitials(
                                  item.customer?.first_name,
                                  item.customer?.last_name
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              {item.customer?.first_name}{" "}
                              {item.customer.last_name}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="ri-shopping-bag-line me-2"></i>
                            <span>
                              {item.cart_items?.length || 0} {t("items")}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-success">AED {item.total}</span>
                        </td>
                        <td>{item.vendor?.full_name}</td>
                        <td>
                          <span
                            className={
                              "badge bg-" +
                              statusBadge(item?.status) +
                              "-subtle text-" +
                              statusBadge(item?.status)
                            }
                          >
                            {item.status}
                          </span>
                        </td>
                        {/* <td>
                        <h5 className="fs-14 fw-medium mb-0">
                          {item.rating}
                          <span className="text-muted fs-11 ms-1">
                            ({item.votes} votes)
                          </span>
                        </h5>
                      </td> */}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
