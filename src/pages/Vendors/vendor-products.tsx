import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Button } from "reactstrap";
import { VendorProductsList } from "./vendor-products-list";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getVendorProductsQuery } from "slices/thunks";
import AddProductModal from "./modals/add-product-modal";

const VendorProducts = () => {
  const { t } = useTranslation();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendorProductsData, setVendorProductsData] = useState<any[]>([]);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorProducts: state.vendorProducts,
    vendorProductsSuccess: state.vendorProductsSuccess,
    error: state.error,
  }));
  // Inside your component
  const { vendorError, vendorProducts, vendorProductsSuccess } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (vendorId) {
      dispatch(getVendorProductsQuery(vendorId));
    }
  }, [vendorId]);

  React.useEffect(() => {
    if (vendorProducts?.list) {
      console.log("vendorProducts: ", vendorProducts.list);
      setVendorProductsData(vendorProducts?.list);
    }
    if (vendorProductsSuccess) {
      console.log("vendorProductsSuccess: ", vendorProductsSuccess);
      tog_standard();
    }
    if (vendorError?.message || vendorError?.errors) {
      console.log("vendorError: ", vendorError);
    }
  }, [vendorProducts, vendorError, vendorProductsSuccess]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="w-full d-flex justify-content-end">
            <Button color="primary" onClick={() => tog_standard()}>
              {t("Add Product")}
            </Button>
          </div>
          <VendorProductsList data={vendorProductsData ?? []} />
        </Col>
      </Row>
      {/* Default Modal */}
      <AddProductModal
        modal_standard={modal_standard}
        tog_standard={tog_standard}
      />
    </React.Fragment>
  );
};

export default VendorProducts;
