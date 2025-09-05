import React, { useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Button, Col, Input, Label, Row } from "reactstrap";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { TOrderStatus } from "types";
import { useTranslation } from "react-i18next";

const OrdersList = ({ data }: { data: any[] }) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((row) => {
    const statusMatch = statusFilter ? row.status === statusFilter : true;
    const vendorMatch = vendorTypeFilter
      ? row.vendor?.vendor?.vendorType === vendorTypeFilter
      : true;

    const dateMatch =
      startDate && endDate
        ? new Date(row.orderDate || "2025-01-01") >= new Date(startDate) &&
          new Date(row.orderDate || "2025-01-01") <= new Date(endDate)
        : true;

    const searchMatch = searchTerm
      ? row.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.customer?.customer?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        row.customer?.customer?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        row.customer?.customer?.phone?.includes(searchTerm) ||
        row.status?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return statusMatch && vendorMatch && dateMatch && searchMatch;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "SearchTableData.xlsx");
  };

  const statusCellBadge = (status: TOrderStatus) => {
    switch (status) {
      case "WAITING":
        return (
          <span className="badge bg-warning-subtle text-warning">
            {t("WAITING")}
          </span>
        );
      case "CANCELED":
        return (
          <span className="badge bg-danger-subtle text-danger">
            {t("CANCELED")}
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="badge bg-success-subtle text-success">
            {t("CONFIRMED")}
          </span>
        );
      case "PROGRESSING":
        return (
          <span className="badge bg-info-subtle text-info">
            {t("PROGRESSING")}
          </span>
        );
      case "PROCESSING":
        return (
          <span className="badge bg-info-subtle text-info">
            {t("PROCESSING")}
          </span>
        );
      case "DELIVERED":
        return (
          <span className="badge bg-success-subtle text-success">
            {t("DELIVERED")}
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary">
            {status}
          </span>
        );
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("Order Number"),
        accessorKey: "orderNumber",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span className="fw-semibold" key={"order-number-" + cell.getValue()}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        header: t("Customer Name"),
        accessorKey: "customer",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const customer = cell.getValue()?.customer;
          return `${customer?.firstName || ""} ${customer?.lastName || ""}`;
        },
      },
      {
        header: t("Customer Phone"),
        accessorKey: "customer",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue()?.customer?.phone || "",
      },
      {
        header: t("Order Date"),
        accessorKey: "fOrderDate",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div>
              <div className="text-warning">
                {t("Ordered:")} {cell.getValue()}
              </div>

              <div className="text-info">
                {t("Processed:")}{" "}
                {row.processedDate ?? <span className="text-muted">---</span>}
              </div>

              <div className="text-success">
                {t("Delivered:")}{" "}
                {row.deliveredDate ?? <span className="text-muted">---</span>}
              </div>
            </div>
          );
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => statusCellBadge(cell.getValue()),
      },
      {
        header: t("Total"),
        accessorKey: "total",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span key={"order-total-" + cell.getValue()}>
            {cell.getValue() + ".00" + " AED"}
          </span>
        ),
      },
      {
        header: t("Invoice"),
        accessorKey: "orderId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            key={"order-action-" + cell.getValue()}
            to={`/dashboard/customers/orders/${cell.getValue()}`}
            className="link-info"
          >
            {t("Get Invoice")}
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      {/* Filters Row */}
      <Row className="mb-3">
        <Col md={2}>
          <Label>{t("Search")}</Label>
          <Input
            type="text"
            placeholder={t("Search orders, names, phone...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </Col>
        <Col md={2}>
          <Label>{t("Status")}</Label>
          <Input
            type="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">{t("All")}</option>
            <option value="WAITING">{t("WAITING")}</option>
            <option value="PROCESSING">{t("PROCESSING")}</option>
            <option value="DELIVERED">{t("DELIVERED")}</option>
            <option value="CONFIRMED">{t("CONFIRMED")}</option>
            <option value="CANCELED">{t("CANCELED")}</option>
          </Input>
        </Col>
        <Col md={2}>
          <Label>{t("Vendor Type")}</Label>
          <Input
            type="select"
            value={vendorTypeFilter}
            onChange={(e) => setVendorTypeFilter(e.target.value)}
          >
            <option value="">{t("All")}</option>
            <option value="GROCERY">GROCERY</option>
            <option value="RESTAURANT">RESTAURANT</option>
            <option value="PHARMACY">PHARMACY</option>
          </Input>
        </Col>
        <Col md={2}>
          <Label>{t("Start Date")}</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Label>{t("End Date")}</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button color="success" onClick={exportToExcel} className="w-100">
            {t("Export Excel")}
          </Button>
        </Col>
      </Row>

      <TableContainer
        columns={columns || []}
        data={filteredData || []}
        isGlobalFilter={false}
        customPageSize={5}
      />
    </React.Fragment>
  );
};

export { OrdersList };
