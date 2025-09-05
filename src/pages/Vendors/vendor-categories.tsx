import React, { useState } from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
  Badge,
} from "reactstrap";
import { Button } from "reactstrap";
import { VendorCategoriesList } from "./vendor-categories-list";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useParams } from "react-router-dom";
import {
  addVendorCategoryMutation,
  updateVendorCategoryMutation,
  deleteVendorCategoryMutation,
  toggleVendorCategoryQuery,
  getVendorCategoriesQuery,
} from "slices/thunks";
import { clearVendorSuccess } from "slices/vendors/reducer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { errorToastManager } from "helpers/error-helper";
import { useTranslation } from "react-i18next";

const VendorCategories = () => {
  const { t } = useTranslation();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendorCategoriesData, setVendorCategoriesData] = useState<any[]>([]);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [modal_update, setmodal_update] = useState<boolean>(false);
  const [modal_delete, setmodal_delete] = useState<boolean>(false);
  const [currentVendorCategory, setCurrentVendorCategory] = useState<
    Record<any, any>
  >({});
  const [categoryId, setCategoryId] = useState<any>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<any>(null);
  const [deletedCategory, setDeletedCategory] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  function tog_update() {
    setmodal_update(!modal_update);
  }

  function tog_delete() {
    setmodal_delete(!modal_delete);
  }

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorCategories: state.vendorCategories,
    vendorCategoryAddedSuccess: state.vendorCategoriesSuccess,
    error: state.error,
  }));

  const { vendorError, vendorCategories, error, vendorCategoryAddedSuccess } =
    useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (vendorId) {
      console.log("vendorId: ", vendorId);

      dispatch(getVendorCategoriesQuery(vendorId));
    }
  }, [vendorId]);

  React.useEffect(() => {
    if (vendorCategories?.list) {
      console.log("vendorCategories: ", vendorCategories.list);
      setVendorCategoriesData(vendorCategories?.list);
    }
  }, [vendorCategories]);

  React.useEffect(() => {
    if (vendorError?.message || vendorError?.errors) {
      console.log("vendorError: ", vendorError);
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(vendorError, toast.error);

      // If there was a deleted category and an error occurred, restore the category
      if (deletedCategory) {
        setVendorCategoriesData((prevData) => [...prevData, deletedCategory]);
        setDeletedCategory(null);
        // Show specific delete failure toast
        toast.error(t("Failed to delete vendor category. Please try again."), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [vendorError, deletedCategory]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: "",
      arName: "",
      isPublished: "published",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter English Name"),
      arName: Yup.string().required("Please Enter Arabic Name"),
      isPublished: Yup.string().required("Please Select Status"),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);
      const formData = {
        name: values.name,
        ar_name: values.arName,
        is_published: values.isPublished === "published",
      };
      dispatch(addVendorCategoryMutation(formData, vendorId));
    },
  });

  const handleDelete = (categoryId: number) => {
    // Find the category to be deleted
    const categoryToDelete = vendorCategoriesData.find(
      (category) => category.category.categoryId === categoryId
    );
    if (categoryToDelete) {
      // Store the deleted category for potential restoration
      setDeletedCategory(categoryToDelete);
      // Optimistically remove the category from the list
      setVendorCategoriesData((prevData) =>
        prevData.filter(
          (category) => category.category.categoryId !== categoryId
        )
      );
    }
    dispatch(deleteVendorCategoryMutation(categoryId, vendorId));
  };

  const handleToggle = (categoryId: number, currentStatus: boolean) => {
    // Optimistically update the UI
    setVendorCategoriesData((prevData) =>
      prevData.map((category) =>
        category.category.categoryId === categoryId
          ? {
              ...category,
              category: {
                ...category.category,
                published: !currentStatus,
              },
            }
          : category
      )
    );

    dispatch(toggleVendorCategoryQuery(categoryId));
  };

  const updateValidation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      categoryId: currentVendorCategory?.category?.categoryId ?? "",
      name: currentVendorCategory?.category?.name ?? "",
      arName: currentVendorCategory?.category?.arName ?? "",
      isPublished: currentVendorCategory?.category?.published
        ? "published"
        : "unpublished",
    },
    validationSchema: Yup.object({
      categoryId: Yup.string().required("Please Enter Category Id"),
      name: Yup.string().required("Please Enter English Name"),
      arName: Yup.string().required("Please Enter Arabic Name"),
      isPublished: Yup.string().required("Please Select Status"),
    }),
    onSubmit: (values) => {
      console.log("update-form-values: ", values);
      const formData = {
        categoryId: currentVendorCategory?.category?.categoryId,
        name: values.name,
        ar_name: values.arName,
        is_published: values.isPublished === "published",
      };
      dispatch(updateVendorCategoryMutation(formData, vendorId));
    },
  });

  // Handle success state after formik validations are declared
  React.useEffect(() => {
    if (vendorCategoryAddedSuccess) {
      console.log("vendorCategoryAddedSuccess: ", vendorCategoryAddedSuccess);
      // Only close the add modal if it's open
      if (modal_standard) {
        tog_standard();
      }
      // Only close the update modal if it's open
      if (modal_update) {
        tog_update();
      }
      // Reset form after success
      validation.resetForm();
      updateValidation.resetForm();

      // Clear the deleted category state on successful operation
      if (deletedCategory) {
        setDeletedCategory(null);
        // Show delete success toast
        toast.success(t("Vendor category deleted successfully!"), {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Clear the success state after handling it
      setTimeout(() => {
        dispatch(clearVendorSuccess());
      }, 100);
    }
  }, [
    vendorCategoryAddedSuccess,
    modal_standard,
    modal_update,
    validation,
    updateValidation,
    dispatch,
    deletedCategory,
  ]);

  // Filter categories based on status
  const filteredCategories = vendorCategoriesData.filter((category) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "published") return category.category?.published;
    if (statusFilter === "unpublished") return !category.category?.published;
    return true;
  });

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <Label className="form-label mb-0">{t("Filter by Status:")}</Label>
              <select
                className="form-select"
                style={{ width: "auto" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t("All Categories")}</option>
                <option value="published">{t("Published")}</option>
                <option value="unpublished">{t("Unpublished")}</option>
              </select>
            </div>
            <Button color="primary" onClick={() => tog_standard()}>
              {t("Add Category")}
            </Button>
          </div>
          <VendorCategoriesList
            data={filteredCategories}
            onEditCategory={(category) => {
              setCurrentVendorCategory(category);
              setCategoryId(category.category.categoryId);
              tog_update();
            }}
            onDeleteCategory={(categoryId) => {
              setDeleteCategoryId(categoryId);
              tog_delete();
            }}
            onToggleCategory={handleToggle}
          />
        </Col>
      </Row>

      {/* Add Category Modal */}
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
          {t("Add Category")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            id="add-vendor-category-form"
          >
            {vendorCategoryAddedSuccess && !vendorError?.message ? (
              <>
                <Alert color="success">
                  {t("Vendor Category Successfully Added")}
                </Alert>
              </>
            ) : null}
            {vendorError?.message && !vendorCategoryAddedSuccess ? (
              <Alert color="danger">{String(vendorError?.message)}</Alert>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
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
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      <div>{String(validation.errors.name)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="arName" className="form-label">
                    {t("Arabic Name")}
                  </Label>
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
                  {validation.touched.arName && validation.errors.arName ? (
                    <FormFeedback type="invalid">
                      <div>{String(validation.errors.arName)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="isPublished" className="form-label">
                    {t("Status")}
                  </Label>
                  <select
                    className="form-select"
                    id="isPublished"
                    name="isPublished"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.isPublished || ""}
                  >
                    <option value="">{t("Select Status")}</option>
                    <option value="published">{t("Published")}</option>
                    <option value="unpublished">{t("Unpublished")}</option>
                  </select>
                  {validation.touched.isPublished &&
                  validation.errors.isPublished ? (
                    <div className="text-danger mt-1">
                      {String(validation.errors.isPublished)}
                    </div>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="add-vendor-category-btn"
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
            {t("Close")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("add-vendor-category-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>

      {/* Update Category Modal */}
      <Modal
        id="updateModal"
        isOpen={modal_update}
        toggle={() => {
          tog_update();
        }}
      >
        <ModalHeader
          className="modal-title"
          id="updateModalLabel"
          toggle={() => {
            tog_update();
          }}
        >
          {t("Update Category")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              updateValidation.handleSubmit();
              return false;
            }}
            id="update-vendor-category-form"
          >
            {vendorCategoryAddedSuccess && !vendorError?.message ? (
              <>
                <Alert color="success">
                  {t("Vendor Category Successfully Updated")}
                </Alert>
              </>
            ) : null}
            {vendorError?.message && !vendorCategoryAddedSuccess ? (
              <Alert color="danger">{String(vendorError?.message)}</Alert>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
                <div>
                  <Input
                    type="hidden"
                    className="form-control"
                    id="categoryId"
                    name="categoryId"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.categoryId || ""}
                    invalid={
                      updateValidation.touched.categoryId &&
                      updateValidation.errors.categoryId
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updateName" className="form-label">
                    {t("English Name")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="updateName"
                    name="name"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.name || ""}
                    invalid={
                      updateValidation.touched.name &&
                      updateValidation.errors.name
                        ? true
                        : false
                    }
                  />
                  {updateValidation.touched.name &&
                  updateValidation.errors.name ? (
                    <FormFeedback type="invalid">
                      <div>{String(updateValidation.errors.name)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updateArName" className="form-label">
                    {t("Arabic Name")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="updateArName"
                    name="arName"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.arName || ""}
                    invalid={
                      updateValidation.touched.arName &&
                      updateValidation.errors.arName
                        ? true
                        : false
                    }
                  />
                  {updateValidation.touched.arName &&
                  updateValidation.errors.arName ? (
                    <FormFeedback type="invalid">
                      <div>{String(updateValidation.errors.arName)}</div>
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="updateIsPublished" className="form-label">
                    {t("Status")}
                  </Label>
                  <select
                    className="form-select"
                    id="updateIsPublished"
                    name="isPublished"
                    onChange={updateValidation.handleChange}
                    onBlur={updateValidation.handleBlur}
                    value={updateValidation.values.isPublished || ""}
                  >
                    <option value="">{t("Select Status")}</option>
                    <option value="published">{t("Published")}</option>
                    <option value="unpublished">{t("Unpublished")}</option>
                  </select>
                  {updateValidation.touched.isPublished &&
                  updateValidation.errors.isPublished ? (
                    <div className="text-danger mt-1">
                      {String(updateValidation.errors.isPublished)}
                    </div>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="update-vendor-category-btn"
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
              tog_update();
            }}
          >
            {t("Close")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              document.getElementById("update-vendor-category-btn")?.click();
            }}
          >
            {t("Save changes")}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
      >
        <ModalHeader
          className="modal-title"
          toggle={() => {
            tog_delete();
          }}
        >
          {t("Confirm Delete")}
        </ModalHeader>
        <ModalBody>
          <p>
            {t("Are you sure you want to delete this vendor category? This action cannot be undone.")}
          </p>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_delete();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            color="danger"
            onClick={() => {
              handleDelete(deleteCategoryId);
              tog_delete();
            }}
          >
            {t("Delete")}
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default VendorCategories;
