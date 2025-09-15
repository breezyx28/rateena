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
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import EditProductModal from "./modals/edit-product-modal";
import DeleteConfirmationModal from "./modals/delete-confirmation-modal";
import { imgURL } from "services/api-handles";
import {
  addOptionMutation,
  addProductImageMutation,
  deleteOptionMutation,
  deleteProductImageMutation,
  getProductQuery,
  toggleProductPublishQuery,
} from "slices/thunks";

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

      // Comprehensive analysis of all incoming options
      if (
        productData?.product?.options &&
        productData.product.options.length > 0
      ) {
        console.log("=== OPTIONS ANALYSIS ===");
        console.log(
          "Total options received:",
          productData.product.options.length
        );

        // Analyze each option individually
        productData.product.options.forEach((option: any, index: number) => {
          console.log(`Option ${index + 1}:`, {
            id: option.option_id,
            name: option.name,
            group_flag: option.group_flag,
            fee: option.fee,
            type: categorizeOption(option),
          });
        });

        // Categorize all options
        const categorizedOptions = categorizeAllOptions(
          productData.product.options
        );
        console.log("Categorized options:", categorizedOptions);
        console.log("=== END ANALYSIS ===");
      }

      setNewOptionName("");
      setNewOptionFee("");
      setNewOptionGroup("");
      setActiveOptionGroup(null);
      setShowNewGroupForm(false);
    }
  }, [productData]);

  // Handle success/error responses for option mutations
  React.useEffect(() => {
    if (productUpdatedSuccess) {
      Swal.fire({
        title: "Success!",
        text: "Operation completed successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  }, [productUpdatedSuccess]);

  React.useEffect(() => {
    if (productError) {
      Swal.fire({
        title: "Error!",
        text: productError || "Something went wrong",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [productError]);

  // Function to categorize a single option
  const categorizeOption = (option: any): string => {
    if (
      option.group_flag != null &&
      option.group_flag !== "" &&
      option.group_flag !== "null"
    ) {
      if (option.fee == null || option.fee == 0) {
        return "GROUP_OPTION";
      } else {
        return "GROUP_WITH_FEE"; // Edge case: group with fee
      }
    } else if (option.fee > 0) {
      return "ADDON";
    } else {
      return "UNCATEGORIZED"; // Edge case: no group, no fee
    }
  };

  // Function to categorize all options comprehensively
  const categorizeAllOptions = (options: any[]) => {
    const categorized = {
      groups: new Map<string, any[]>(),
      addons: [] as any[],
      groupWithFee: [] as any[],
      uncategorized: [] as any[],
    };

    options.forEach((option: any) => {
      const type = categorizeOption(option);

      switch (type) {
        case "GROUP_OPTION":
          if (!categorized.groups.has(option.group_flag)) {
            categorized.groups.set(option.group_flag, []);
          }
          categorized.groups.get(option.group_flag)!.push(option);
          break;
        case "ADDON":
          categorized.addons.push(option);
          break;
        case "GROUP_WITH_FEE":
          categorized.groupWithFee.push(option);
          break;
        case "UNCATEGORIZED":
          categorized.uncategorized.push(option);
          break;
      }
    });

    return categorized;
  };

  // Get categorized options for display
  const categorizedOptions = selectedProduct?.options
    ? categorizeAllOptions(selectedProduct.options)
    : {
        groups: new Map<string, any[]>(),
        addons: [],
        groupWithFee: [],
        uncategorized: [],
      };

  // Extract group names for display
  const optionGroups: string[] = Array.from(categorizedOptions.groups.keys());

  // Get all group options (for display in groups section)
  const groupOptions = Array.from(categorizedOptions.groups.values()).flat();

  // Get all addon options (for display in addons section)
  const addonOptions = categorizedOptions.addons;

  // Get edge case options (group with fee - treat as addons)
  const groupWithFeeOptions = categorizedOptions.groupWithFee;

  // Get uncategorized options (display as addons with 0 fee)
  const uncategorizedOptions = categorizedOptions.uncategorized;

  const toggleEditModal = () => setShowEditModal(!showEditModal);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const handleTogglePublish = () => {
    const action = selectedProduct?.published ? "unpublish" : "publish";
    const actionCapitalized = selectedProduct?.published
      ? "Unpublish"
      : "Publish";

    Swal.fire({
      title: t(`${actionCapitalized} Product`),
      text: t(`Are you sure you want to ${action} this product?`),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, do it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t(`${actionCapitalized}...`),
          text: t(`Please wait while we ${action} the product`),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        dispatch(toggleProductPublishQuery(productId));
      }
    });
  };

  const handleAddOptionGroup = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: t("Add Option"),
      text: t("Are you sure you want to add this option to the group?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, add it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t("Adding..."),
          text: t("Please wait while we add the option"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        dispatch(
          addOptionMutation({
            name: newOptionName,
            groupFlag: newOptionGroup || activeOptionGroup,
            fee: 0,
            productId,
          })
        );

        // Reset form
        setNewOptionName("");
        setNewOptionFee("");
        setNewOptionGroup("");
        setActiveOptionGroup(null);
        setShowNewGroupForm(false);
      }
    });
  };

  const handleAddOptionAddon = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: t("Add Addon"),
      text: t("Are you sure you want to add this addon?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, add it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t("Adding..."),
          text: t("Please wait while we add the addon"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        dispatch(
          addOptionMutation({
            name: newOptionName,
            fee: newOptionFee,
            groupFlag: null,
            productId,
          })
        );

        // Reset form
        setNewOptionName("");
        setNewOptionFee("");
        setNewOptionGroup("");
        setActiveOptionGroup(null);
        setShowNewGroupForm(false);
      }
    });
  };

  const handleDeleteOption = (optionId: number) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t("Deleting..."),
          text: t("Please wait while we delete the option"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        dispatch(deleteOptionMutation(optionId, productId));
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }

    Swal.fire({
      title: t("Upload Image"),
      text: t("Are you sure you want to upload this image?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, upload it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t("Uploading..."),
          text: t("Please wait while we upload the image"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const formData = new FormData();

        if (e.target.files) {
          formData.append("image", e.target.files[0]);
        }

        dispatch(addProductImageMutation(formData, productId));
      }
    });
  };

  const handleRemoveImage = (imagePath: string) => {
    Swal.fire({
      title: t("Remove Image"),
      text: t("Are you sure you want to remove this image?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, remove it!"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: t("Removing..."),
          text: t("Please wait while we remove the image"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        dispatch(deleteProductImageMutation(productId, imagePath));
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={t("Product Details")} pageTitle={t("Vendors")} />

          <ToastContainer />

          {selectedProduct ? (
            <div className="d-flex flex-column gap-4">
              {/* Alerts */}
              <div className="d-flex flex-wrap gap-3">
                {selectedProduct?.quantity <= 5 ? (
                  <Alert color="warning" className="d-flex align-items-center">
                    <i className="ri-alert-line me-2"></i>
                    {t("Low quantity alert! Only")} {selectedProduct?.quantity}{" "}
                    {t("items left.")}
                    <Button
                      color="link"
                      className="p-0 ms-2 text-decoration-underline"
                      onClick={toggleEditModal}
                    >
                      {t("Update")}
                    </Button>
                    {selectedProduct?.published && (
                      <Button
                        color="link"
                        className="p-0 ms-2 text-decoration-underline"
                        onClick={handleTogglePublish}
                      >
                        {t("Unpublish")}
                      </Button>
                    )}
                  </Alert>
                ) : (
                  <span className="quantity-text fw-bold text-white bg-dark px-2 py-1 rounded">
                    {t("Quantity") + " : " + selectedProduct?.quantity}
                  </span>
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
                  {/* <Button color="danger" size="sm" onClick={toggleDeleteModal}>
                    <i className="ri-delete-bin-line"></i>
                  </Button> */}
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

                    {/* Product Characteristics */}
                    <Card>
                      <CardBody>
                        <h5 className="card-title">
                          {t("Product Characteristics")}
                        </h5>
                        {optionGroups.length > 0 ? (
                          optionGroups.map((group: string) => {
                            const groupOptionsList =
                              categorizedOptions.groups.get(group) || [];
                            return (
                              <div
                                key={group}
                                className="border border-dashed rounded p-3 mb-3"
                              >
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                  <p className="text-muted text-capitalize mb-2 w-100">
                                    {group} ({groupOptionsList.length} options)
                                  </p>
                                  {groupOptionsList.map((option: any) => (
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
                                        activeOptionGroup === group
                                          ? null
                                          : group
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
                                    <Button
                                      type="submit"
                                      color="primary"
                                      size="sm"
                                    >
                                      {t("Add")}
                                    </Button>
                                  </Form>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-muted text-center py-3">
                            {t("No product characteristics defined yet")}
                          </div>
                        )}

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

                    {/* Product Addons */}
                    <Card>
                      <CardBody>
                        <h5 className="card-title">{t("Product Addons")}</h5>
                        <div className="border border-dashed rounded p-3">
                          {/* Regular Addons */}
                          {addonOptions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                Regular Addons ({addonOptions.length})
                              </h6>
                              <div className="d-flex flex-wrap align-items-start gap-2">
                                {addonOptions.map((option: any) => (
                                  <div
                                    key={option.option_id}
                                    className="d-flex align-items-center"
                                  >
                                    <Badge
                                      color="secondary"
                                      className="d-flex align-items-center gap-1"
                                    >
                                      <span>{option.name}</span>
                                      <Badge
                                        color="light"
                                        className="text-dark"
                                      >
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
                              </div>
                            </div>
                          )}

                          {/* Group Options with Fee (Edge Case) */}
                          {groupWithFeeOptions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                Group Options with Fee (
                                {groupWithFeeOptions.length})
                              </h6>
                              <div className="d-flex flex-wrap align-items-start gap-2">
                                {groupWithFeeOptions.map((option: any) => (
                                  <div
                                    key={option.option_id}
                                    className="d-flex align-items-center"
                                  >
                                    <Badge
                                      color="warning"
                                      className="d-flex align-items-center gap-1"
                                    >
                                      <span>{option.name}</span>
                                      <Badge
                                        color="light"
                                        className="text-dark"
                                      >
                                        {option.fee} AED
                                      </Badge>
                                      <small className="text-muted">
                                        ({option.group_flag})
                                      </small>
                                      <i
                                        className="ri-close-circle-line cursor-pointer"
                                        onClick={() =>
                                          handleDeleteOption(option.option_id)
                                        }
                                      ></i>
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Uncategoryized Options (Edge Case) */}
                          {uncategorizedOptions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                Uncategorized Options (
                                {uncategorizedOptions.length})
                              </h6>
                              <div className="d-flex flex-wrap align-items-start gap-2">
                                {uncategorizedOptions.map((option: any) => (
                                  <div
                                    key={option.option_id}
                                    className="d-flex align-items-center"
                                  >
                                    <Badge
                                      color="info"
                                      className="d-flex align-items-center gap-1"
                                    >
                                      <span>{option.name}</span>
                                      <Badge
                                        color="light"
                                        className="text-dark"
                                      >
                                        {option.fee || 0} AED
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
                              </div>
                            </div>
                          )}

                          {/* Add New Addon Button */}
                          <div className="d-flex flex-wrap align-items-start gap-2 mb-3">
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
                              <i className="ri-add-line"></i>{" "}
                              {t("Add New Addon")}
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
