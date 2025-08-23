import React, { useState } from "react";
import {
  Alert,
  Col,
  Input,
  Label,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from "reactstrap";
import { VendorCategoriesList } from "./vendor-categories-list";
import { Form, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  addVendorCategoryMutation,
  getVendorCategoriesQuery,
} from "slices/thunks";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";

const VendorCategories = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendorCategoriesData, setVendorCategoriesData] = useState<any[]>([]);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorCategories: state.vendorCategories,
    vendorCategoriesSuccess: state.vendorCategoriesSuccess,
    error: state.error,
  }));
  // Inside your component
  const { vendorError, vendorCategories, vendorCategoriesSuccess } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (vendorId) {
      dispatch(getVendorCategoriesQuery(vendorId));
    }
  }, [vendorId]);

  React.useEffect(() => {
    if (vendorCategories?.list) {
      console.log("vendorCategories: ", vendorCategories.list);
      setVendorCategoriesData(vendorCategories?.list);
    }
    if (vendorCategoriesSuccess) {
      console.log("vendorCategoriesSuccess: ", vendorCategoriesSuccess);
      tog_standard();
    }
    if (vendorError) {
      console.log("vendorError: ", vendorError);
    }
  }, [vendorCategories, vendorError, vendorCategoriesSuccess]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: "",
      ar_name: "",
      is_published: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Category English Name"),
      ar_name: Yup.string().required("Please Enter Category Arabic Name"),
      is_published: Yup.boolean().required(
        "Please Select if it Published or not"
      ),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);

      dispatch(addVendorCategoryMutation(values, vendorId));
    },
  });

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="w-full d-flex justify-content-end">
            <Button color="primary" onClick={() => tog_standard()}>
              Add Category
            </Button>
          </div>
          <VendorCategoriesList data={vendorCategoriesData} />
        </Col>
      </Row>
      {/* Default Modal */}
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
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            id="add-vendor-user-form"
          >
            {vendorCategories?.list && vendorCategoriesSuccess ? (
              <>
                {toast("Your Redirect To Login Page...", {
                  position: "top-right",
                  hideProgressBar: false,
                  className: "bg-success text-white",
                  progress: undefined,
                  toastId: "",
                })}
                <ToastContainer autoClose={2000} limit={1} />
                <Alert color="success">{vendorCategories?.list}</Alert>
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
                  <Label htmlFor="ar_name" className="form-label">
                    Arabic Name
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
                        validation.touched.ar_name && validation.errors.ar_name
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="is_published" className="form-label">
                    Select Publish
                  </Label>
                  <Input
                    type="select"
                    name="is_published"
                    id="is_published"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.is_published || ""}
                    invalid={
                      validation.touched.is_published &&
                      !!validation.errors.is_published
                    }
                  >
                    <option value="">Select status</option>
                    <option value="false">UnPublished</option>
                    <option value="true">Published</option>
                  </Input>

                  {validation.touched.is_published &&
                  validation.errors.is_published ? (
                    <FormFeedback>
                      {validation.errors.is_published}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="add-vendor-user-btn"
              style={{
                visibility: "hidden",
              }}
            >
              Submit
            </Button>
          </Form>
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
              document.getElementById("add-vendor-user-btn")?.click();
            }}
          >
            Save changes
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default VendorCategories;
