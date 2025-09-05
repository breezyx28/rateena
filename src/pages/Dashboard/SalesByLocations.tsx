import React from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
// import Vector from './VectorMap';
import { VectorMap } from "@south-paw/react-vector-maps";
import world from "../../common/world.svg.json";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const SalesByLocations = ({ details }: { details: any }) => {
  const { t } = useTranslation();

  const generateExcelReport = () => {
    const salesByLocation = details?.salesByLocation || {};

    // Prepare data for Excel
    const excelData = Object.entries(salesByLocation).map(
      ([location, value]) => ({
        [t("Location")]: location,
        [t("Percentage")]:
          typeof value === "string" && value.includes("%")
            ? value
            : `${value}%`,
      })
    );

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 25 }, // Location
      { wch: 15 }, // Percentage
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, t("Sales by Locations"));

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `sales_by_locations_report_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              {t("Sales by Locations")}
            </h4>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="btn btn-soft-primary btn-sm material-shadow-none"
                onClick={generateExcelReport}
              >
                {t("Export Report")}
              </button>
            </div>
          </CardHeader>

          <CardBody>
            <div
              data-colors='["--vz-light", "--vz-success", "--vz-primary"]'
              style={{ height: "269px" }}
              dir="ltr"
            >
              <div id="world_map_line_markers" className="custom-vector-map">
                <VectorMap {...world} />
              </div>
            </div>

            <div className="px-2 pt-2 mt-3 mb-0">
              {details?.salesByLocation &&
                Object.entries(details?.salesByLocation).map(
                  ([key, value]: any, index: number) => (
                    <div className={`w-full mb-1 ${index > 0 ? "mt-3" : ""}`}>
                      <div className="w-full mb-1 d-flex justify-content-between">
                        <span>{key}</span>
                        <span className="">{value}</span>
                      </div>
                      <div className="progress mt-2" style={{ height: "6px" }}>
                        <div
                          className="progress-bar progress-bar-striped bg-primary"
                          role="progressbar"
                          style={{
                            width: value,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default SalesByLocations;
