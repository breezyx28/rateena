import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Alert,
  FormGroup,
  Input,
  Label,
  Form,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import EditProductModal from "./modals/edit-product-modal";
import DeleteConfirmationModal from "./modals/delete-confirmation-modal";
import { imgURL } from "services/api-handles";
import {
  addOptionMutation,
  addProductImageMutation,
  deleteOptionMutation,
  deleteProductImageMutation,
  deleteProductMutation,
  getProductQuery,
  toggleProductPublishQuery,
  toggleProductApproveQuery,
} from "slices/thunks";
import Swal from "sweetalert2";

const VendorProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const { t, i18n } = useTranslation();

  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionFee, setNewOptionFee] = useState("");
  const [newOptionGroup, setNewOptionGroup] = useState("");
  const [activeOptionGroup, setActiveOptionGroup] = useState<string | null>(
    null
  );
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  const selectLayoutState = (state: any) => state.Products;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    success: state.success,
    error: state.error,
    loading: state.loading,
    productData: state.productData,
    productUpdatedSuccess: state.productUpdatedSuccess,
    productError: state.productError,
  }));

  const { productUpdatedSuccess, productData, productError, loading } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    dispatch(getProductQuery(Number(productId)));
  }, []);

  React.useEffect(() => {
    if (productData) {
      console.log("productData: ", productData);
      setSelectedProduct(productData?.product);
    }
  }, [productData]);

  const optionGroups: string[] = Array.from(
    new Set(
      selectedProduct?.options
        ?.filter(
          (op: any) => op.group_flag != null && (op.fee == null || op.fee == 0)
        )
        ?.map((op: any) => op.group_flag) || []
    )
  ) as string[];

  const toggleEditModal = () => setShowEditModal(!showEditModal);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const handleTogglePublish = async () => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t(`Do you want to ${selectedProduct?.published ? 'unpublish' : 'publish'} this product?`),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, Update Status"),
      cancelButtonText: t("Cancel"),
    });

    if (result.isConfirmed) {
      try {
        dispatch(toggleProductPublishQuery(productId));
        Swal.fire({
          icon: "success",
          title: t("Success!"),
          text: t("Product status updated successfully!"),
          confirmButtonText: t("OK"),
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("Error!"),
          text: t("Failed to update product status"),
          confirmButtonText: t("OK"),
        });
      }
    }
  };

  const handleToggleApprove = async () => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t(`Do you want to ${selectedProduct?.is_approved ? 'disapprove' : 'approve'} this product?`),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, Update Status"),
      cancelButtonText: t("Cancel"),
    });

    if (result.isConfirmed) {
      try {
        dispatch(toggleProductApproveQuery(productId));
        Swal.fire({
          icon: "success",
          title: t("Success!"),
          text: t("Product approval status updated successfully!"),
          confirmButtonText: t("OK"),
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("Error!"),
          text: t("Failed to update product approval status"),
          confirmButtonText: t("OK"),
        });
      }
    }
  };

  // const handleDeleteProduct = () => {
  //   console.log("Delete product");
  //   dispatch(deleteProductMutation(productId));
  //   toggleDeleteModal();
  //   navigate(-1);
  // };

  const handleAddOptionGroup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add option Group:", {
      name: newOptionName,
      groupFlag: newOptionGroup || activeOptionGroup,
      fee: null,
      productId,
    });
    // Reset form
    setNewOptionName("");
    setNewOptionFee("");
    setNewOptionGroup("");
    setActiveOptionGroup(null);
    setShowNewGroupForm(false);
    dispatch(
      addOptionMutation({
        name: newOptionName,
        groupFlag: newOptionGroup || activeOptionGroup,
        fee: 0,
        productId,
      })
    );
  };

  const handleAddOptionAddon = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add option Addon:", {
      name: newOptionName,
      fee: newOptionFee,
      groupFlag: null,
      productId,
    });
    // Reset form
    setNewOptionName("");
    setNewOptionFee("");
    setNewOptionGroup("");
    setActiveOptionGroup(null);
    setShowNewGroupForm(false);
    dispatch(
      addOptionMutation({
        name: newOptionName,
        fee: newOptionFee,
        groupFlag: null,
        productId,
      })
    );
  };

  const handleDeleteOption = (optionId: number) => {
    console.log("Delete option:", optionId);
    dispatch(deleteOptionMutation(optionId, productId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }

    const formData = new FormData();

    if (e.target.files) {
      formData.append("image", e.target.files[0]);
    }

    dispatch(addProductImageMutation(formData, productId));
  };

  const handleRemoveImage = (imagePath: string) => {
    console.log("Remove image:", imagePath);
    dispatch(deleteProductImageMutation(productId, imagePath));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={t("Product Details")} pageTitle={t("Vendors")} />



          {selectedProduct && Object.keys(selectedProduct).length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {/* Alerts */}
              <div className="d-flex flex-wrap gap-3">
                {selectedProduct.quantity <= 5 && (
                  <Alert color="warning" className="d-flex align-items-center">
                    <i className="ri-alert-line me-2"></i>
                    {t("Low quantity alert! Please update the quantity.")}
                    <Button
                      color="link"
                      className="p-0 ms-2 text-decoration-underline"
                      onClick={toggleEditModal}
                    >
                      {t("Update")}
                    </Button>
                  </Alert>
                )}
                {!selectedProduct?.published && (
                  <Alert color="info" className="d-flex align-items-center">
                    <i className="ri-information-line me-2"></i>
                    {t("This product is not visible to customers")}
                  </Alert>
                )}
              </div>

              {/* Product Header */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <h2 className="mb-0">
                  {selectedProduct?.name} / {selectedProduct?.arName}
                </h2>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Badge color="success" className="fs-6">
                    {selectedProduct?.category?.name}
                  </Badge>
                  <Badge color="info" className="fs-6">
                    {t("Company Profit:")} {selectedProduct?.companyProfit}%
                  </Badge>
                  <Badge color={selectedProduct?.quantity <= 5 ? "danger" : "secondary"} className="fs-6">
                    {t("Quantity")}: <span className="quantity-text fw-bold text-white bg-dark px-2 py-1 rounded">{selectedProduct?.quantity || 0}</span>
                  </Badge>
                  <Badge color="warning" className="fs-6">
                    {selectedProduct?.duration}
                  </Badge>
                  <Button 
                    color={selectedProduct?.is_approved ? "success" : "outline-success"} 
                    size="sm" 
                    onClick={handleToggleApprove}
                  >
                    <i className={selectedProduct?.is_approved ? "ri-check-line" : "ri-close-line"}></i>
                    {selectedProduct?.is_approved ? t("Approved") : t("Not Approved")}
                  </Button>
                  <Button 
                    color={selectedProduct?.published ? "primary" : "outline-primary"} 
                    size="sm" 
                    onClick={handleTogglePublish}
                  >
                    <i className={selectedProduct?.published ? "ri-eye-line" : "ri-eye-off-line"}></i>
                    {selectedProduct?.published ? t("Published") : t("Unpublished")}
                  </Button>
                  <Button color="primary" size="sm" onClick={toggleEditModal}>
                    <i className="ri-edit-line"></i>
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <Row>
                {/* Product Details */}
                <Col lg={8}>
                  <div className="d-flex flex-column gap-4">
                    {/* Description */}
                    <Card>
                      <CardBody>
                        <div className="mb-3">
                          <p className="text-muted mb-2">
                            {selectedProduct?.description}
                          </p>
                          <p className="text-muted">
                            {selectedProduct?.arDescription}
                          </p>
                        </div>
                        <h3 className="text-primary mb-0">
                          {selectedProduct?.finalPrice?.toFixed(2)}
                          <span className="fs-5 ms-1">AED</span>
                        </h3>
                      </CardBody>
                    </Card>

                    {/* Product Options */}
                    <Card>
                      <CardBody>
                        <h5 className="card-title">{t("Product Options")}</h5>
                        
                        {/* Groups */}
                        {optionGroups.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">{t("Product Characteristics")}</h6>
                            {optionGroups.map((group: string) => (
                              <div
                                key={group}
                                className="border border-dashed rounded p-3 mb-3"
                              >
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                  <p className="text-muted text-capitalize mb-2 w-100">
                                    {group}
                                  </p>
                                  {selectedProduct?.options
                                    ?.filter(
                                      (op: any) =>
                                        op.group_flag === group &&
                                        (op.fee == null || op.fee == 0)
                                    )
                                    ?.map((option: any) => (
                                      <div
                                        key={option.option_id}
                                        className="d-flex align-items-center"
                                      >
                                        <Badge
                                          color="secondary"
                                          className="d-flex align-items-center gap-1"
                                        >
                                          <span>{option.name}</span>
                                          <i
                                            className="ri-close-circle-line cursor-pointer"
                                            onClick={() =>
                                              handleDeleteOption(option.option_id)
                                            }
                                          ></i>
                                        </Badge>
                                      </div>
                                    ))}
                                  <Button
                                    color="success"
                                    outline
                                    size="sm"
                                    onClick={() =>
                                      setActiveOptionGroup(
                                        activeOptionGroup === group ? null : group
                                      )
                                    }
                                  >
                                    <i className="ri-add-line"></i>
                                  </Button>
                                </div>
                                {activeOptionGroup === group && (
                                  <Form
                                    onSubmit={handleAddOptionGroup}
                                    className="d-flex align-items-end gap-2 mt-3"
                                  >
                                    <div className="flex-grow-1">
                                      <Input
                                        type="text"
                                        placeholder={t("Eg: Large")}
                                        value={newOptionName}
                                        onChange={(e) =>
                                          setNewOptionName(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                    <Button type="submit" color="primary" size="sm">
                                      {t("Add")}
                                    </Button>
                                  </Form>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Addons */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">{t("Product Addons")}</h6>
                          <div className="border border-dashed rounded p-3">
                            <div className="d-flex flex-wrap align-items-start gap-2 mb-3">
                              {selectedProduct?.options
                                ?.filter(
                                  (option: any) =>
                                    option.group_flag == null && option.fee > 0
                                )
                                ?.map((option: any) => (
                                  <div
                                    key={option.option_id}
                                    className="d-flex align-items-center"
                                  >
                                    <Badge
                                      color="secondary"
                                      className="d-flex align-items-center gap-1"
                                    >
                                      <span>{option.name}</span>
                                      <Badge color="light" className="text-dark">
                                        {option.fee} AED
                                      </Badge>
                                      <i
                                        className="ri-close-circle-line cursor-pointer"
                                        onClick={() =>
                                          handleDeleteOption(option.option_id)
                                        }
                                      ></i>
                                    </Badge>
                                  </div>
                                ))}
                              <Button
                                color="success"
                                outline
                                size="sm"
                                onClick={() =>
                                  setActiveOptionGroup(
                                    activeOptionGroup === "addons"
                                      ? null
                                      : "addons"
                                  )
                                }
                              >
                                <i className="ri-add-line"></i>
                              </Button>
                            </div>

                            {activeOptionGroup === "addons" && (
                              <Form
                                onSubmit={handleAddOptionAddon}
                                className="d-flex align-items-end gap-2"
                              >
                                <div className="flex-grow-1">
                                  <Input
                                    type="text"
                                    placeholder={t("Addon name")}
                                    value={newOptionName}
                                    onChange={(e) =>
                                      setNewOptionName(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <Input
                                    type="number"
                                    placeholder={t("Fee")}
                                    value={newOptionFee}
                                    onChange={(e) =>
                                      setNewOptionFee(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <Button type="submit" color="primary" size="sm">
                                  {t("Add")}
                                </Button>
                              </Form>
                            )}
                          </div>
                        </div>

                        {/* Add New Group Form */}
                        {showNewGroupForm && (
                          <Form
                            onSubmit={handleAddOptionGroup}
                            className="d-flex align-items-end gap-2 mb-3"
                          >
                            <div className="flex-grow-1">
                              <Input
                                type="text"
                                placeholder={t("Eg: Size")}
                                value={newOptionName}
                                onChange={(e) =>
                                  setNewOptionName(e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="flex-grow-1">
                              <Input
                                type="text"
                                placeholder={t("Group name")}
                                value={newOptionGroup}
                                onChange={(e) =>
                                  setNewOptionGroup(e.target.value)
                                }
                                required
                              />
                            </div>
                            <Button type="submit" color="primary" size="sm">
                              {t("Add")}
                            </Button>
                          </Form>
                        )}

                        <Button
                          color="success"
                          outline
                          size="sm"
                          onClick={() => setShowNewGroupForm(!showNewGroupForm)}
                        >
                          {t("New Group")}
                        </Button>
                      </CardBody>
                    </Card>
                  </div>
                </Col>

                {/* Product Images */}
                <Col lg={4}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title">{t("Product Images")}</h5>
                      <div className="d-flex flex-column gap-3">
                        {selectedProduct?.images?.map(
                          (img: string, index: number) => (
                            <div key={index} className="position-relative">
                              <img
                                src={`${imgURL}/${img}`}
                                alt={`Product ${index + 1}`}
                                className="img-fluid rounded"
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                color="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-2"
                                onClick={() => handleRemoveImage(img)}
                              >
                                <i className="ri-close-line"></i>
                              </Button>
                            </div>
                          )
                        )}

                        <div>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-2"
                          />
                          {selectedFiles.length > 0 && (
                            <div className="text-muted">
                              {selectedFiles.length} {t("file(s) selected")}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{t("Loading...")}</span>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Modals */}
      <EditProductModal
        modal_standard={showEditModal}
        tog_standard={toggleEditModal}
        productData={selectedProduct}
      />
      {/* 
      <DeleteConfirmationModal
        modal_standard={showDeleteModal}
        tog_standard={toggleDeleteModal}
        onConfirm={handleDeleteProduct}
        productName={selectedProduct?.name || ""}
      /> */}
    </React.Fragment>
  );
};

export default VendorProductDetails;
