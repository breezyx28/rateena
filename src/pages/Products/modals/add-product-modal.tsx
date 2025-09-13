import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
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
import Swal from "sweetalert2";
import { addVendorProductMutation } from "slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import {
  vendorProductInitialValues,
  VendorProductvalidationSchema,
} from "../validation/product-validation";
import { useTranslation } from "react-i18next";

const AddProductModal = ({
  modal_standard,
  tog_standard,
}: {
  modal_standard: boolean;
  tog_standard: () => any;
}) => {
  const { i18n, t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
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
    vendorData: state.vendorData,
  }));
  // Inside your component
  const { vendorError, vendorProductSuccess, vendorCategories, vendorData } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (vendorProductSuccess) {
      console.log("vendorProductSuccess: ", vendorProductSuccess);
      tog_standard();
    }
    if (vendorError?.message) {
      console.log("vendorError: ", vendorError);
    }
    if (vendorCategories) {
      console.log("vendorCategories: ", vendorCategories);
    }
  }, [vendorError, vendorProductSuccess, vendorCategories]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...vendorProductInitialValues,
      isFood: vendorData?.vendor?.vendorType === "RESTAURANT",
    },
    validationSchema: VendorProductvalidationSchema(),
    onSubmit: (values) => {
      const formData = new FormData();
      console.log("form-values: ", values);

      const productPayload = {
        vendor_id: Number(vendorId),
        ...values,
        options:
          !values.options?.[0]?.name &&
          !values.options?.[0]?.group_flag &&
          !values.options?.[0]?.fee
            ? null
            : values.options,
      };

      console.log("productPayload:  ", productPayload);

      formData.append("productPayload", JSON.stringify(productPayload));

      selectedFiles.forEach((file: File, index: number) => {
        formData.append(`productImages[${index}]`, file);
      });

      dispatch(addVendorProductMutation(formData, vendorId));
    },
  });
  return (
    <>
      <Modal
        id="myModal"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
        size="lg"
        fullscreen
      >
        <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          {t("Add Product")}
        </ModalHeader>
        <ModalBody>
          <FormikProvider value={validation}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              id="add-vendor-product-form"
            >
              {vendorProductSuccess && !vendorError?.message ? (
                <>
                  {Swal.fire({
                    title: "Your Redirect To Login Page...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                  })}
                  <Alert color="success">
                    {t("Product has been added successfully")}
                  </Alert>
                </>
              ) : null}
              {vendorError?.message && !vendorProductSuccess ? (
                <>
                  {Swal.fire({
                    title: t("Error Adding Product"),
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false
                  })}
                  <Alert color="danger">{vendorError?.message}</Alert>
                </>
              ) : null}
              <Row className="gy-4">
                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="name" className="form-label">
                      {t("English Name")}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
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
                  </div>
                </Col>

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="ar_name" className="form-label">
                      {t("Arabic Name")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
                        id="ar_name"
                        name="ar_name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ar_name || ""}
                        invalid={
                          validation.touched.ar_name &&
                          validation.errors.ar_name
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="quantity" className="form-label">
                      {t("Quantity")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        placeholder={t("Eg: 5")}
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
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={6}>
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

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="price" className="form-label">
                      {t("Price")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        placeholder={t("Eg: 5")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price || ""}
                        invalid={
                          validation.touched.price && validation.errors.price
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="company_profit" className="form-label">
                      {t("Company Profit %")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
                        id="company_profit"
                        name="company_profit"
                        placeholder={t("Eg: 5")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.company_profit || ""}
                        invalid={
                          validation.touched.company_profit &&
                          validation.errors.company_profit
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={6}>
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
                    </div>
                  </div>
                </Col>

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="category_id" className="form-label">
                      {t("Select Category")}
                    </Label>
                    <Input
                      type="select"
                      name="category_id"
                      id="category_id"
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
                          <option value={item.category.categoryId}>
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

                <Col xxl={4} md={6}>
                  <div>
                    <Label htmlFor="images" className="form-label">
                      {t("Product Images")}
                    </Label>

                    {/* File Upload */}
                    <Input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3">
                        <Label className="form-label text-muted">
                          {t("Selected Images:")}
                        </Label>
                        <div className="d-flex gap-2 flex-wrap">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Selected ${index + 1}`}
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

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="description" className="form-label">
                      {t("English Description")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
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
                    </div>
                  </div>
                </Col>

                <Col xxl={6} md={6}>
                  <div>
                    <Label htmlFor="ar_description" className="form-label">
                      {t("Arabic Description")}
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
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
                                  <Col md={4}>
                                    <Label htmlFor={`options.${index}.op_name`}>
                                      {t("Option Name")}
                                    </Label>
                                    <Input
                                      type="text"
                                      id={`options.${index}.op_name`}
                                      name={`options.${index}.op_name`}
                                      value={option.op_name}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.op_name &&
                                        !!validation.errors.options?.[index]
                                          ?.op_name
                                      }
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.op_name
                                      }
                                    </FormFeedback>
                                  </Col>

                                  <Col md={4}>
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

                                  <Col md={4}>
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

                                  <Col md={1}>
                                    <Button
                                      color="danger"
                                      type="button"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      -
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
                                op_name: "",
                                fee: "",
                                group_flag: "",
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
                id="add-vendor-product-btn"
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
              document.getElementById("add-vendor-product-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddProductModal;
