import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Button } from "reactstrap";
import { ProductsList } from "./products-list";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getProductsQuery } from "slices/thunks";
import AddProductModal from "./modals/add-product-modal";

const Products = () => {
  const { t } = useTranslation();
  const [ProductsData, setProductsData] = useState<any[]>([]);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Products;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    ProductsError: state.ProductsError,
    productsListSuccess: state.productsListSuccess,
    productUpdatedSuccess: state.productUpdatedSuccess,
    error: state.error,
  }));
  // Inside your component
  const { ProductsError, productsListSuccess, productUpdatedSuccess } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    dispatch(getProductsQuery());
  }, []);

  React.useEffect(() => {
    console.log("productsListSuccess:", productsListSuccess);

    if (productsListSuccess?.list) {
      console.log("productsListSuccess: ", productsListSuccess.list);
      setProductsData(productsListSuccess?.list);
    }
    if (productUpdatedSuccess) {
      console.log("productUpdatedSuccess: ", productUpdatedSuccess);
      tog_standard();
    }
    if (ProductsError?.message || ProductsError?.errors) {
      console.log("ProductsError: ", ProductsError);
    }
  }, [productsListSuccess, ProductsError, productUpdatedSuccess]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">{t("Products")}</h5>
                </CardHeader>
                <CardBody>
                  <div className="w-full d-flex justify-content-end">
                    <Button color="primary" onClick={() => tog_standard()}>
                      {t("Add Product")}
                    </Button>
                  </div>
                  <ProductsList data={ProductsData ?? []} />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Default Modal */}
          <AddProductModal
            modal_standard={modal_standard}
            tog_standard={tog_standard}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Products;
