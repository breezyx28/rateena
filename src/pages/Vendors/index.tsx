import React from "react";
import { Col, Container, Row } from "reactstrap";
import { SearchTable } from "./ReactTable";

const Vendors = () => {
  document.title = "Vendors | Rateena - E-Shop Admin Panel";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <SearchTable />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Vendors;
