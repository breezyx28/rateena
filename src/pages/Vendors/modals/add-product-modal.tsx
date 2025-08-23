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
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { addVendorProductMutation } from "slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import {
  vendorProductInitialValues,
  VendorProductvalidationSchema,
} from "../validation/product-validation";
import { vendorCategoriesSuccess } from "slices/vendors/reducer";
import { useTranslation } from "react-i18next";

// Register the plugins once
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddProductModal = ({
  modal_standard,
  tog_standard,
}: {
  modal_standard: boolean;
  tog_standard: () => any;
}) => {
  const { i18n } = useTranslation();
  const [productImages, setProductImages] = useState<any>([]);
  const { vendorId } = useParams<{ vendorId: string }>();
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorProductsSuccess: state.vendorProductsSuccess,
    vendorCategories: state.vendorCategories,
    error: state.error,
  }));
  // Inside your component
  const { vendorError, vendorProductsSuccess, vendorCategories } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (vendorProductsSuccess) {
      console.log("vendorProductsSuccess: ", vendorProductsSuccess);
      tog_standard();
    }
    if (vendorError) {
      console.log("vendorError: ", vendorError);
    }
    if (vendorCategories) {
      console.log("vendorCategories: ", vendorCategories);
    }
  }, [vendorError, vendorProductsSuccess, vendorCategories]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: vendorProductInitialValues,
    validationSchema: VendorProductvalidationSchema(),
    onSubmit: (values) => {
      console.log("form-values: ", values);

      dispatch(addVendorProductMutation(values, vendorId));
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
      >
        <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          Add User
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
              {vendorProductsSuccess ? (
                <>
                  {toast("Your Redirect To Login Page...", {
                    position: "top-right",
                    hideProgressBar: false,
                    className: "bg-success text-white",
                    progress: undefined,
                    toastId: "",
                  })}
                  <ToastContainer autoClose={2000} limit={1} />
                  <Alert color="success">
                    Product has been added successfully
                  </Alert>
                </>
              ) : null}
              <Row className="gy-4">
                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="name" className="form-label">
                      English Name
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

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="arName" className="form-label">
                      Arabic Name
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
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
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="quantity" className="form-label">
                      Qunatity
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
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
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="price" className="form-label">
                      Price
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
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
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="companyProfit" className="form-label">
                      Company Profit %
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="number"
                        className="form-control"
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
                    </div>
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="duration" className="form-label">
                      Ready within
                    </Label>
                    <div className="form-icon">
                      <Input
                        type="text"
                        className="form-control"
                        id="duration"
                        name="duration"
                        placeholder="Eg: From 1 To 5 days or mins."
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

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="categoryId" className="form-label">
                      Select Category
                    </Label>
                    <Input
                      type="select"
                      name="categoryId"
                      id="categoryId"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.categoryId || ""}
                      invalid={
                        validation.touched.categoryId &&
                        !!validation.errors.categoryId
                      }
                    >
                      <option value="">Select Category</option>
                      {vendorCategories?.list &&
                        vendorCategories?.list.map((item: any) => (
                          <option value={item.category.categoryId}>
                            {i18n.dir() === "rtl"
                              ? item.category.arName
                              : item.category.name}
                          </option>
                        ))}
                    </Input>

                    {validation.touched.is_published &&
                    validation.errors.is_published ? (
                      <FormFeedback>
                        {validation.errors.is_published}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="images" className="form-label">
                      Product Images
                    </Label>

                    <FilePond
                      id={"images"}
                      files={productImages}
                      onupdatefiles={setProductImages}
                      allowMultiple={false}
                      maxFiles={3}
                      name="images"
                      className="filepond filepond-input-multiple"
                    />

                    {validation.touched.images && validation.errors.images ? (
                      <FormFeedback>{validation.errors.images}</FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="description" className="form-label">
                      English Description
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

                <Col xxl={12} md={12}>
                  <div>
                    <Label htmlFor="ar_description" className="form-label">
                      Arabic Description
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
                    <Label className="form-label">Product Options</Label>
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
                                    <Label htmlFor={`options.${index}.opName`}>
                                      Option Name
                                    </Label>
                                    <Input
                                      type="text"
                                      id={`options.${index}.opName`}
                                      name={`options.${index}.opName`}
                                      value={option.opName}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.opName &&
                                        !!validation.errors.options?.[index]
                                          ?.opName
                                      }
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.opName
                                      }
                                    </FormFeedback>
                                  </Col>

                                  <Col md={4}>
                                    <Label htmlFor={`options.${index}.fee`}>
                                      Fee
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
                                      htmlFor={`options.${index}.groupFlag`}
                                    >
                                      Group Flag
                                    </Label>
                                    <Input
                                      type="text"
                                      id={`options.${index}.groupFlag`}
                                      name={`options.${index}.groupFlag`}
                                      value={option.groupFlag}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched.options?.[index]
                                          ?.groupFlag &&
                                        !!validation.errors.options?.[index]
                                          ?.groupFlag
                                      }
                                    />
                                    <FormFeedback>
                                      {
                                        (
                                          validation.errors.options?.[
                                            index
                                          ] as any
                                        )?.groupFlag
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
                                opName: "",
                                fee: "",
                                groupFlag: "",
                              })
                            }
                          >
                            + Add Option
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
            Close
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("add-vendor-product-btn")?.click();
            }}
          >
            Save changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddProductModal;
