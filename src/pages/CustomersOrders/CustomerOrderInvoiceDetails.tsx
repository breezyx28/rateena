import React from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Table,
  CardHeader,
  Container,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, useParams } from "react-router-dom";

import logoLight from "../../assets/images/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { getOrderInvoiceQuery } from "slices/thunks";
import { createSelector } from "reselect";
import { orderInvoice } from "slices/orders/reducer";
import { useTranslation } from "react-i18next";

const CustomerOrderInvoiceDetails = () => {
  const { t } = useTranslation();
  document.title = "Invoice Details | Rateena - E-Shop Admin Panel";

  const { orderId } = useParams<{ orderId: string }>();
  const dispatch: any = useDispatch();
  //Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  const selectLayoutState = (state: any) => state.Orders;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    orderInvoiceData: state.orderInvoiceData,
    orderError: state.orderError,
    error: state.error,
  }));
  // Inside your component
  const { error, orderInvoiceData, orderError } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (orderInvoiceData) {
      console.log("orderInvoiceData: ", orderInvoiceData);
      // setInvoiceData()
    }
    if (orderError) {
      console.log("orderError: ", orderError);
    }
  }, [orderInvoiceData, orderError]);

  React.useEffect(() => {
    if (orderId) dispatch(getOrderInvoiceQuery(orderId));
  }, [orderId]);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title={t("Invoice Details")} pageTitle={t("Invoices")} />

        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="demo">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom-dashed p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <img
                          src={logoLight}
                          className="card-logo"
                          alt="logo"
                          height="17"
                        />
                        <div className="mt-sm-5 mt-4">
                          <h6 className="text-muted text-uppercase fw-semibold">
                            {t("Address")}
                          </h6>
                          <p className="text-muted mb-1" id="address-details">
                            California, United States
                          </p>
                          <p className="text-muted mb-0" id="zip-code">
                            <span>Zip-code: 90201</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">
                            {t("Legal Registration No:")}
                          </span>{" "}
                          <span id="legal-register-no">987654</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">{t("Email")}:</span>{" "}
                          <span id="email">velzon@themesbrand.com</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Website:</span>{" "}
                          <Link to="#" className="link-primary" id="website">
                            www.themesbrand.com
                          </Link>
                        </h6>
                        <h6 className="mb-0">
                          <span className="text-muted fw-normal">
                            {t("Contact No:")}
                          </span>{" "}
                          <span id="contact-no"> +(01) 234 6789</span>
                        </h6>
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          {t("Invoice No")}
                        </p>
                        <h5 className="fs-14 mb-0">
                          #
                          <span id="invoice-no">
                            {orderInvoiceData?.invoice?.invoiceNumber ||
                              "25000355"}
                          </span>
                        </h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          {t("Date")}
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-date">
                            {orderInvoiceData?.invoice?.issueDate
                              ? new Date(
                                  orderInvoiceData.invoice.issueDate
                                ).toLocaleDateString()
                              : "23 Nov, 2021"}
                          </span>{" "}
                          <small className="text-muted" id="invoice-time">
                            {orderInvoiceData?.invoice?.issueDate
                              ? new Date(
                                  orderInvoiceData.invoice.issueDate
                                ).toLocaleTimeString()
                              : "02:36PM"}
                          </small>
                        </h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          {t("Payment Status")}
                        </p>
                        <span
                          className={`badge fs-11 ${
                            orderInvoiceData?.invoice?.status === "PAID"
                              ? "bg-success-subtle text-success"
                              : "bg-warning-subtle text-warning"
                          }`}
                          id="payment-status"
                        >
                          {orderInvoiceData?.invoice?.status || "Paid"}
                        </span>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          {t("Total Amount")}
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="total-amount">
                            {String(
                              orderInvoiceData?.invoice?.summary?.total ?? 0
                            )}{" "}
                            AED
                          </span>
                        </h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-top border-top-dashed">
                    <Row className="g-3">
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          {t("Billing Address")}
                        </h6>
                        <p className="fw-medium mb-2" id="billing-name">
                          {orderInvoiceData?.invoice?.order?.order?.customer
                            ?.customer
                            ? `${orderInvoiceData.invoice.order.order.customer.customer.firstName} ${orderInvoiceData.invoice.order.order.customer.customer.lastName}`
                            : "David Nichols"}
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1"
                        >
                          {orderInvoiceData?.invoice?.order?.order?.address
                            ?.street || "305 S San Gabriel Blvd"}
                        </p>
                        <p className="text-muted mb-1">
                          <span>{t("Phone")}: +</span>
                          <span id="billing-phone-no">
                            {orderInvoiceData?.invoice?.order?.order?.customer
                              ?.customer?.phone || "(123) 456-7890"}
                          </span>
                        </p>
                        <p className="text-muted mb-0">
                          <span>Tax: </span>
                          <span id="billing-tax-no">12-3456789</span>
                        </p>
                      </Col>
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          {t("Shipping Address")}
                        </h6>
                        <p className="fw-medium mb-2" id="shipping-name">
                          {orderInvoiceData?.invoice?.order?.order?.address
                            ?.name || "David Nichols"}
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="shipping-address-line-1"
                        >
                          {orderInvoiceData?.invoice?.order?.order?.address
                            ?.street || "305 S San Gabriel Blvd"}
                        </p>
                        <p className="text-muted mb-1">
                          <span>{t("Phone")}: +</span>
                          <span id="shipping-phone-no">
                            {orderInvoiceData?.invoice?.order?.order?.address
                              ?.phone || "(123) 456-7890"}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <div className="table-responsive">
                      <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" style={{ width: "50px" }}>
                              #
                            </th>
                            <th scope="col">{t("Product Details")}</th>
                            <th scope="col">{t("Rate")}</th>
                            <th scope="col">{t("Quantity")}</th>
                            <th scope="col" className="text-end">
                              {t("Amount")}
                            </th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {orderInvoiceData?.invoice?.order?.order?.cartItems
                            ?.list.length > 0 ? (
                            orderInvoiceData?.invoice?.order?.order?.cartItems?.list?.map(
                              (item: any, index: number) => (
                                <tr key={index}>
                                  <th scope="row">
                                    {String(index + 1).padStart(2, "0")}
                                  </th>
                                  <td className="text-start">
                                    <span className="fw-medium">
                                      {item.cartItem?.product?.product?.name ||
                                        "Product Name"}
                                    </span>
                                    <p className="text-muted mb-0">
                                      {item.cartItem?.product?.product
                                        ?.description || "Product Description"}
                                    </p>
                                  </td>
                                  <td>{item.cartItem?.price || 0} AED</td>
                                  <td>{item.cartItem?.quantity || 0}</td>
                                  <td className="text-end">
                                    {item.cartItem?.price *
                                      item.cartItem?.quantity || 0}{" "}
                                    AED
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <th scope="row">01</th>
                              <td className="text-start">
                                <span className="fw-medium">
                                  {t("No items found")}
                                </span>
                              </td>
                              <td>0 AED</td>
                              <td>0</td>
                              <td className="text-end">0 AED</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table
                        className="table table-borderless table-nowrap align-middle mb-0 ms-auto"
                        style={{ width: "250px" }}
                      >
                        <tbody>
                          <tr>
                            <td>{t("Sub Total")}</td>
                            <td className="text-end">
                              {orderInvoiceData?.invoice?.summary?.subtotal ??
                                0}{" "}
                              AED
                            </td>
                          </tr>
                          <tr>
                            <td>{t("Taxes")}</td>
                            <td className="text-end">
                              {orderInvoiceData?.invoice?.summary?.taxes ?? 0}{" "}
                              AED
                            </td>
                          </tr>
                          <tr>
                            <td>{t("Discount")}</td>
                            <td className="text-end">
                              -{" "}
                              {orderInvoiceData?.invoice?.summary?.discount ??
                                0}{" "}
                              AED
                            </td>
                          </tr>
                          <tr>
                            <td>{t("Shipping Charge")}</td>
                            <td className="text-end">
                              {orderInvoiceData?.invoice?.summary
                                ?.shippingCost ?? 0}{" "}
                              AED
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">{t("Total Amount")}</th>
                            <th className="text-end">
                              {orderInvoiceData?.invoice?.summary?.total ?? 0}{" "}
                              AED
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="mt-3">
                      <h6 className="text-muted text-uppercase fw-semibold mb-3">
                        {t("Payment Details:")}
                      </h6>
                      <p className="text-muted mb-1">
                        {t("Payment Method:")}{" "}
                        <span className="fw-medium" id="payment-method">
                          {orderInvoiceData?.invoice?.paymentMethod ||
                            "Mastercard"}
                        </span>
                      </p>
                      <p className="text-muted mb-1">
                        {t("Card Holder:")}{" "}
                        <span className="fw-medium" id="card-holder-name">
                          {orderInvoiceData?.invoice?.order?.order?.customer
                            ?.customer
                            ? `${orderInvoiceData.invoice.order.order.customer.customer.firstName} ${orderInvoiceData.invoice.order.order.customer.customer.lastName}`
                            : "David Nichols"}
                        </span>
                      </p>
                      <p className="text-muted mb-1">
                        {t("Order Number:")}{" "}
                        <span className="fw-medium" id="order-number">
                          {orderInvoiceData?.invoice?.order?.order
                            ?.orderNumber || "N/A"}
                        </span>
                      </p>
                      <p className="text-muted">
                        {t("Total Amount:")}{" "}
                        <span className="fw-medium" id="">
                          {orderInvoiceData?.invoice?.summary?.total || 0} AED
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="alert alert-info">
                        <p className="mb-0">
                          <span className="fw-semibold">{t("NOTES:")}</span>
                          <span id="note">
                            {" "}
                            {t("All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above.")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <Link
                        to="#"
                        onClick={printInvoice}
                        className="btn btn-success"
                      >
                        <i className="ri-printer-line align-bottom me-1"></i>{" "}
                        {t("Print")}
                      </Link>
                      <Link to="#" className="btn btn-primary">
                        <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                        {t("Download")}
                      </Link>
                    </div>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomerOrderInvoiceDetails;
