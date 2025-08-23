import React, { useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Button, Col, Input, Label, Row } from "reactstrap";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { TOrderStatus } from "types";

const OrdersList = ({ data }: { data: any[] }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

    return statusMatch && vendorMatch && dateMatch;
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
          <span className="badge bg-warning-subtle text-warning">WAITING</span>
        );
      case "CANCELED":
        return (
          <span className="badge bg-danger-subtle text-danger">CANCELED</span>
        );
      case "CONFIRMED":
        return (
          <span className="badge bg-success-subtle text-success">
            CONFIRMED
          </span>
        );
      case "PROGRESSING":
        return (
          <span className="badge bg-info-subtle text-info">PROGRESSING</span>
        );
      case "PROCESSING":
        return (
          <span className="badge bg-info-subtle text-info">PROCESSING</span>
        );
      case "DELIVERED":
        return (
          <span className="badge bg-success-subtle text-success">
            DELIVERED
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
        header: "Order Number",
        accessorKey: "orderNumber",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span className="fw-semibold" key={"order-number-" + cell.getValue()}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        header: "Customer Name",
        accessorKey: "customer",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const customer = cell.getValue()?.customer;
          return `${customer?.firstName || ""} ${customer?.lastName || ""}`;
        },
      },
      {
        header: "Customer Phone",
        accessorKey: "customer",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue()?.customer?.phone || "",
      },
      {
        header: "Order Date",
        accessorKey: "fOrderDate",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div>
              <div className="text-warning">Ordered: {cell.getValue()}</div>

              <div className="text-info">
                Processed:{" "}
                {row.processedDate ?? <span className="text-muted">---</span>}
              </div>

              <div className="text-success">
                Delivered:{" "}
                {row.deliveredDate ?? <span className="text-muted">---</span>}
              </div>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => statusCellBadge(cell.getValue()),
      },
      {
        header: "Total",
        accessorKey: "total",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span key={"order-total-" + cell.getValue()}>
            {cell.getValue() + ".00" + " AED"}
          </span>
        ),
      },
      {
        header: "Invoice",
        accessorKey: "orderId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            key={"order-action-" + cell.getValue()}
            to={`/dashboard/customers/orders/${cell.getValue()}`}
            className="link-info"
          >
            Get
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
          <Label>Status</Label>
          <Input
            type="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="WAITING">WAITING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELED">CANCELED</option>
          </Input>
        </Col>
        <Col md={2}>
          <Label>Vendor Type</Label>
          <Input
            type="select"
            value={vendorTypeFilter}
            onChange={(e) => setVendorTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="GROCERY">GROCERY</option>
            <option value="RESTAURANT">RESTAURANT</option>
            <option value="PHARMACY">PHARMACY</option>
          </Input>
        </Col>
        <Col md={2}>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button color="success" onClick={exportToExcel} className="w-100">
            Export Excel
          </Button>
        </Col>
      </Row>

      <TableContainer
        columns={columns || []}
        data={filteredData || []}
        isGlobalFilter={true}
        customPageSize={5}
        SearchPlaceholder="Search..."
      />
    </React.Fragment>
  );
};

export { OrdersList };
