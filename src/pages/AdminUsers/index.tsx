import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Button } from "reactstrap";
import { AdminUsersListTable } from "./AdminUsersListTable";
import AddModal from "./admin-users-modals/add-modal";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getAdminUsersListQuery } from "slices/thunks";
import { useTranslation } from "react-i18next";

const AdminUsers = () => {
  const { t } = useTranslation();
  document.title = `${t("Admin Users")} | Rateena - E-Shop Admin Panel`;

  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.AdminUsers;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    adminUsersError: state.adminUsersError,
    adminUsersListSuccess: state.adminUsersListSuccess,
    error: state.error,
  }));

  const { adminUsersError, error, adminUsersListSuccess } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    dispatch(getAdminUsersListQuery());
  }, []);

  React.useEffect(() => {
    if (adminUsersListSuccess) {
      console.log("adminUsersListSuccess: ", adminUsersListSuccess);
    }
    if (adminUsersError) {
      console.log("adminUsersError: ", adminUsersError);
    }
  }, [adminUsersError, adminUsersListSuccess]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <div className="live-preview w-full d-flex justify-content-end">
                  <div>
                    <Button color="primary" onClick={tog_standard}>
                      {t("Add User")}
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <h5 className="card-title mb-0">{t("Search")}</h5>
                </CardHeader>
                <CardBody>
                  <AdminUsersListTable
                    data={adminUsersListSuccess?.list ?? []}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* Add User Modal */}
        <AddModal modal_standard={modal_standard} tog_standard={tog_standard} />
      </div>
    </React.Fragment>
  );
};

export default AdminUsers;
