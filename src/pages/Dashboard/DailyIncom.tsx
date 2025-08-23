import React from "react";
import {
  Card,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { StoreVisitsCharts } from "./DashboardEcommerceCharts";
import * as XLSX from "xlsx";

const DailyIncome = ({ details }: { details: any }) => {
  const generateExcelReport = () => {
    const dailyIncome = details?.dailyIncome || {};

    // Prepare data for Excel
    const excelData = Object.entries(dailyIncome).map(([category, value]) => ({
      Category: category,
      // Value: typeof value === "string" ? value : value?.toString() || "0",
      Percentage:
        typeof value === "string" && value.includes("%") ? value : `${value}%`,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Category
      // { wch: 15 }, // Value
      { wch: 15 }, // Percentage
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Income Report");

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `daily_income_report_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Daily Income</h4>
            <div className="flex-shrink-0">
              <UncontrolledDropdown className="card-header-dropdown">
                <DropdownToggle
                  tag="a"
                  className="text-reset dropdown-btn"
                  role="button"
                >
                  <span className="text-muted">
                    Report<i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem onClick={generateExcelReport}>
                    Download Report
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </CardHeader>

          <div className="card-body">
            {/* <div dir="ltr"> */}
            <StoreVisitsCharts
              details={details}
              chartId="store-visits-source"
            />
            {/* </div> */}
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default DailyIncome;
