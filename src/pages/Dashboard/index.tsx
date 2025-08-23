import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import DailyIncome from "./DailyIncom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { adminHomeDetails } from "slices/thunks";

const Dashboard = () => {
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.HomeDetails;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    error: state.error,
    success: state.success,
    homeDetailsError: state.homeDetailsError,
    homeDetailsSuccess: state.homeDetailsSuccess,
  }));
  // Inside your component
  const { homeDetailsError, homeDetailsSuccess, error, success } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    dispatch(adminHomeDetails());
  }, [dispatch]);

  React.useEffect(() => {
    if (error) {
      console.log("error: ", homeDetailsError);
    }
    if (homeDetailsSuccess) {
      console.log("homeDetailsSuccess: ", homeDetailsSuccess);
    }
  }, [error, homeDetailsError, homeDetailsSuccess]);

  document.title = "Dashboard | Rateena - E-Shop Admin Panel";

  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Widget details={homeDetailsSuccess ?? {}} />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Revenue details={homeDetailsSuccess ?? {}} />
                  </Col>
                  <SalesByLocations details={homeDetailsSuccess ?? {}} />
                </Row>
                <Row>
                  <DailyIncome details={homeDetailsSuccess ?? {}} />
                  <RecentOrders details={homeDetailsSuccess ?? {}} />
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
