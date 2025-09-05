import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { UpdateVendorProductvalidationSchema } from "../validation/product-validation";
import { useTranslation } from "react-i18next";
import { imgURL } from "services/api-handles";
import { addVendorProductMutation, getProductQuery } from "slices/thunks";

const EditProductModal = ({
  modal_standard,
  tog_standard,
  productData,
}: {
  modal_standard: boolean;
  tog_standard: () => any;
  productData: any;
}) => {
  const { t, i18n } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (productData?.images && productData.images.length > 0) {
      setExistingImages(productData.images);
    }
  }, [productData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const { vendorId } = useParams<{ vendorId: string }>();
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorProductSuccess: state.vendorProductSuccess,
    vendorCategories: state.vendorCategories,
    error: state.error,
  }));

  const { vendorError, vendorProductSuccess, vendorCategories } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (vendorProductSuccess) {
      console.log("vendorProductSuccess: ", vendorProductSuccess);
      toast("Product Updated Successfully...", {
        position: "top-right",
        hideProgressBar: false,
        className: "bg-success text-white",
      });
      dispatch(getProductQuery(productData.productId));
      tog_standard();
    }
    if (vendorError?.errors) {
      console.log("vendorError: ", vendorError);
      toast("Error updating product", {
        position: "top-right",
        hideProgressBar: false,
        className: "bg-danger text-white",
      });
      validation.setErrors(vendorError);
    }
  }, [vendorError, vendorProductSuccess, vendorCategories]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: productData?.name || "",
      arName: productData?.arName || "",
      quantity: productData?.quantity || "",
      isFood:
        productData?.isFood !== undefined
          ? productData.isFood
          : productData?.vendor?.vendorType === "RESTURANT",
      price: productData?.price || "",
      companyProfit: productData?.companyProfit || "",
      duration: productData?.duration || "",
      category_id: productData?.category?.category_id || "",
      description: productData?.description || "",
      ar_description: productData?.arDescription || "",
      options: productData?.options || [],
    },
    validationSchema: UpdateVendorProductvalidationSchema(),
    validate: (values) => {
      console.log("Validation errors:", validation.errors);
    },
    onSubmit: (values) => {
      console.log("Form validation errors:", validation.errors);
      const formData = new FormData();

      const productPayload = {
        productId: productData.productId,
        vendor_id: Number(vendorId),
        ...values,
      };

      formData.append("productPayload", JSON.stringify(productPayload));

      selectedFiles.forEach((file, index) => {
        formData.append(`productImages[${index}]`, file);
      });

      dispatch(addVendorProductMutation(formData, vendorId));
    },
  });

  return (
    <>
      <Modal
        id="editModal"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
        size="lg"
        fullscreen
      >
        <ModalHeader
          className="modal-title"
          id="editModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          {t("Edit Product")}
        </ModalHeader>
        <ModalBody className="py-3">
          <FormikProvider value={validation}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              id="edit-vendor-product-form"
            >
              {vendorProductSuccess && !vendorError?.message && (
                <Alert color="success">
                  {t("Product has been updated successfully")}
                </Alert>
              )}
              {vendorError?.message && !vendorProductSuccess && (
                <Alert color="danger">{vendorError?.message}</Alert>
              )}
              <Row className="gy-3">
                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="name" className="form-label">
                      {t("English Name")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control form-control-sm"
                      bsSize="sm"
                      id="name"
                      name="name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.name || ""}
                      invalid={
                        validation.touched.name && validation.errors.name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.name && validation.errors.name ? (
                      <FormFeedback>{validation.errors.name}</FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="arName" className="form-label">
                      {t("Arabic Name")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="arName"
                        name="arName"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.arName || ""}
                        invalid={
                          validation.touched.arName && validation.errors.arName
                            ? true
                            : false
                        }
                      />
                      {validation.touched.arName && validation.errors.arName ? (
                        <FormFeedback>{validation.errors.arName}</FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="quantity" className="form-label">
                      {t("Quantity")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="quantity"
                        name="quantity"
                        placeholder="Eg: 5"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.quantity || ""}
                        invalid={
                          validation.touched.quantity &&
                          validation.errors.quantity
                            ? true
                            : false
                        }
                      />
                      {validation.touched.quantity &&
                      validation.errors.quantity ? (
                        <FormFeedback>
                          {validation.errors.quantity}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="isFood"
                      name="isFood"
                      checked={validation.values.isFood || false}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                    <Label htmlFor="isFood" className="form-check-label">
                      {t("Is Food Item")}
                    </Label>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="price" className="form-label">
                      {t("Price")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="price"
                        name="price"
                        placeholder="Eg: 5"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price || ""}
                        invalid={
                          validation.touched.price && validation.errors.price
                            ? true
                            : false
                        }
                      />
                      {validation.touched.price && validation.errors.price ? (
                        <FormFeedback>{validation.errors.price}</FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="companyProfit" className="form-label">
                      {t("Company Profit %")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="companyProfit"
                        name="companyProfit"
                        placeholder="Eg: 5"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.companyProfit || ""}
                        invalid={
                          validation.touched.companyProfit &&
                          validation.errors.companyProfit
                            ? true
                            : false
                        }
                      />
                      {validation.touched.companyProfit &&
                      validation.errors.companyProfit ? (
                        <FormFeedback>
                          {validation.errors.companyProfit}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="duration" className="form-label">
                      {t("Ready within")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
                        id="duration"
                        name="duration"
                        placeholder={t("Eg: From 1 To 5 days or mins.")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.duration || ""}
                        invalid={
                          validation.touched.duration &&
                          validation.errors.duration
                            ? true
                            : false
                        }
                      />
                      {validation.touched.duration &&
                      validation.errors.duration ? (
                        <FormFeedback>
                          {validation.errors.duration}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="category_id" className="form-label">
                      {t("Select Category")}
                    </Label>
                    <Input
                      type="select"
                      name="category_id"
                      id="category_id"
                      bsSize="sm"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.category_id || ""}
                      invalid={
                        validation.touched.category_id &&
                        !!validation.errors.category_id
                      }
                    >
                      <option value="">{t("Select Category")}</option>
                      {vendorCategories?.list &&
                        vendorCategories?.list.map((item: any) => (
                          <option
                            key={item.category.categoryId}
                            value={item.category.categoryId}
                          >
                            {i18n.dir() === "rtl"
                              ? item.category.arName
                              : item.category.name}
                          </option>
                        ))}
                    </Input>

                    {validation.touched.category_id &&
                    validation.errors.category_id ? (
                      <FormFeedback>
                        {validation.errors.category_id}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="images" className="form-label">
                      {t("Product Images")}
                    </Label>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="mb-3">
                        <Label className="form-label text-muted">
                          {t("Current Images:")}
                        </Label>
                        <div className="d-flex gap-2 flex-wrap">
                          {existingImages.map((img, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={`${imgURL}/${img}`}
                                alt={`Product ${index + 1}`}
                                className="rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                style={{ transform: "translate(50%, -50%)" }}
                                onClick={() => removeExistingImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    <Input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control form-control-sm"
                      bsSize="sm"
                    />

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3">
                        <Label className="form-label text-muted">
                          {t("New Images:")}
                        </Label>
                        <div className="d-flex gap-2 flex-wrap">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New ${index + 1}`}
                                className="rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                style={{ transform: "translate(50%, -50%)" }}
                                onClick={() => removeSelectedFile(index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validation.touched.images && validation.errors.images ? (
                      <FormFeedback>{validation.errors.images}</FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="description" className="form-label">
                      {t("English Description")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="description"
                        name="description"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                        invalid={
                          validation.touched.description &&
                          validation.errors.description
                            ? true
                            : false
                        }
                      />
                      {validation.touched.description &&
                      validation.errors.description ? (
                        <FormFeedback>
                          {validation.errors.description}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={4}>
                  <div>
                    <Label htmlFor="ar_description" className="form-label">
                      {t("Arabic Description")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control form-control-sm"
                        bsSize="sm"
                        id="ar_description"
                        name="ar_description"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ar_description || ""}
                        invalid={
                          validation.touched.ar_description &&
                          validation.errors.ar_description
                            ? true
                            : false
                        }
                      />
                      {validation.touched.ar_description &&
                      validation.errors.ar_description ? (
                        <FormFeedback>
                          {validation.errors.ar_description}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label className="form-label">{t("Product Options")}</Label>
                    <FieldArray
                      name="options"
                      render={(arrayHelpers) => (
                        <div>
                          {validation.values.options &&
                            validation.values.options.map(
                              (option: any, index: number) => (
                                <Row
                                  key={index}
                                  className="align-items-end mb-3"
                                >
                                  <Col md={6}>
                                    <Label htmlFor={`options.${index}.name`}>
                                      {t("Option Name")}
                                    </Label>
                                    <Input
                                      type="text"
                                      id={`options.${index}.name`}
                                      name={`options.${index}.name`}
                                      value={option.name}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.name &&
                                        !!validation.errors.options?.[index]
                                          ?.name
                                      }
                                      bsSize="sm"
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.name
                                      }
                                    </FormFeedback>
                                  </Col>

                                  <Col md={6}>
                                    <Label htmlFor={`options.${index}.fee`}>
                                      {t("Fee")}
                                    </Label>
                                    <Input
                                      type="number"
                                      id={`options.${index}.fee`}
                                      name={`options.${index}.fee`}
                                      value={option.fee}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.fee &&
                                        !!validation.errors.options?.[index]
                                          ?.fee
                                      }
                                      bsSize="sm"
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.fee
                                      }
                                    </FormFeedback>
                                  </Col>

                                  <Col md={6}>
                                    <Label
                                      htmlFor={`options.${index}.group_flag`}
                                    >
                                      {t("Group Flag")}
                                    </Label>
                                    <Input
                                      type="text"
                                      id={`options.${index}.group_flag`}
                                      name={`options.${index}.group_flag`}
                                      value={option.group_flag}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.group_flag &&
                                        !!validation.errors.options?.[index]
                                          ?.group_flag
                                      }
                                      bsSize="sm"
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.group_flag
                                      }
                                    </FormFeedback>
                                  </Col>

                                  <Col md={12} className="text-end mt-2">
                                    <Button
                                      color="danger"
                                      type="button"
                                      size="sm"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      {t("Remove")}
                                    </Button>
                                  </Col>
                                </Row>
                              )
                            )}
                          <Button
                            type="button"
                            color="secondary"
                            onClick={() =>
                              arrayHelpers.push({
                                name: "",
                                fee: "",
                                groupFlag: "",
                              })
                            }
                          >
                            {t("+ Add Option")}
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
              <Button
                type={"submit"}
                id="edit-vendor-product-btn"
                style={{
                  visibility: "hidden",
                }}
              >
                Submit
              </Button>
            </Form>
          </FormikProvider>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_standard();
            }}
          >
            {t("Close")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("edit-vendor-product-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditProductModal;
