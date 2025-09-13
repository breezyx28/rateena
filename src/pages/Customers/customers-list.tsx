import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Link } from "react-router-dom";
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
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  blockCustomerMutation,
  deleteCustomerMutation,
  unblockCustomerMutation,
  updateCustomerMutation,
} from "slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

export const CustomersList = ({ data }: { data?: any[] }) => {
  const { i18n, t } = useTranslation();
  const [customerId, setCustomerId] = useState<any>(null);
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [modal_delete, setmodal_delete] = useState<boolean>(false);
  const [filter, setFilter] = useState<any[]>(data || []);
  const [currentCustomer, setCurrentCustomer] = useState<Record<any, any>>({});
  const [deleteCustomerId, setDeleteCustomerId] = useState<any>(null);

  const dispatch: any = useDispatch();

  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  function tog_delete() {
    setmodal_delete(!modal_delete);
  }

  useEffect(() => {
    if (data) {
      setFilter(data);
    }
  }, [data]);

  const handleFilter = (value: any) => {
    let results = filter.filter(
      (item: any) => item.customer?.customerId !== value
    );
    if (results) {
      setFilter(results);
    }
  };

  const handleBlock = (currentBlockState: boolean, customerId: number) => {
    dispatch(
      currentBlockState === false
        ? blockCustomerMutation(customerId)
        : unblockCustomerMutation(customerId)
    );
  };
  const handleDelete = (customerId: number) => {
    dispatch(deleteCustomerMutation(customerId));
  };

  const selectLayoutState = (state: any) => state.Customers;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    customerData: state.customerData,
    customersError: state.customersError,
  }));
  // Inside your component
  const { customersError, customerData } = useSelector(selectLayoutProperties);

  React.useEffect(() => {
    if (customerData) {
      console.log("customerData: ", customerData);
    }
    if (customersError) {
      console.log("customersError: ", customersError);
    }
  }, [customersError, customerData]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name: currentCustomer?.firstName ?? "",
      last_name: currentCustomer?.lastName ?? "",
      email: currentCustomer?.email ?? "",
      phone: currentCustomer?.phone ?? "",
      date_of_birth: currentCustomer?.dateOfBirth ?? "",
      gender: currentCustomer?.gender ?? "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .min(2, t("First name must be at least 2 characters"))
        .max(50, t("First name must not exceed 50 characters"))
        .required(t("First Name is Required")),
      last_name: Yup.string()
        .min(2, t("Last name must be at least 2 characters"))
        .max(50, t("Last name must not exceed 50 characters"))
        .required(t("Last Name is Required")),
      gender: Yup.string()
        .oneOf(["MALE", "FEMALE"], t("Gender must be either MALE or FEMALE"))
        .required(t("Gender is Required")),
      date_of_birth: Yup.date()
        .max(new Date(), t("Date of birth cannot be in the future"))
        .required(t("Date Of Birth is Required")),
      email: Yup.string()
        .email(t("it should match email format"))
        .required(t("Email is Required")),
      phone: Yup.string()
        .matches(/^(009665|\+9665|05)\d{8}$/, t("it should match phone format"))
        .required(t("hone Number is Required")),
    }),
    onSubmit: (values) => {
      console.log("form-values: ", values);
      dispatch(updateCustomerMutation(values, customerId));
    },
  });

  const columns = useMemo(
    () => [
      {
        header: t("ID"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "customer.customerId",
        enableColumnFilter: false,
      },
      {
        header: t("First Name"),
        accessorKey: "customer.firstName",
        enableColumnFilter: false,
      },
      {
        header: t("Last Name"),
        accessorKey: "customer.lastName",
        enableColumnFilter: false,
      },
      {
        header: t("Email"),
        accessorKey: "customer.email",
        enableColumnFilter: false,
      },
      {
        header: t("Phone"),
        accessorKey: "customer.phone",
        enableColumnFilter: false,
      },
      {
        header: t("Gender"),
        accessorKey: "customer.gender",
        enableColumnFilter: false,
      },
      {
        header: t("Date Of Birth"),
        accessorKey: "customer.dateOfBirth",
        enableColumnFilter: false,
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          return (
            <div className="d-flex gap-3">
              <div className="form-check form-switch mb-3" dir="ltr">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id="customSwitchsizesm"
                  defaultChecked={cell.row.original.customer?.blocked}
                  onChange={() =>
                    handleBlock(
                      cell.row.original.customer?.blocked,
                      cell.row.original.customer?.customerId
                    )
                  }
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                className="link-primary"
                onClick={() => {
                  tog_standard();
                  setCurrentCustomer(cell.row.original.customer);
                  setCustomerId(cell.row.original.customer?.customerId);
                }}
              >
                <i className="ri-settings-4-line"></i>
              </div>
              <div
                style={{ cursor: "pointer" }}
                className="link-danger"
                onClick={() => {
                  setDeleteCustomerId(cell.row.original.customer.customerId);
                  tog_delete();
                }}
              >
                <i className="ri-delete-bin-5-line"></i>
              </div>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    [t]
  );

  return (
    <React.Fragment>
      <TableContainer
        columns={columns || []}
        data={filter || []}
        isGlobalFilter={true}
        customPageSize={5}
        SearchPlaceholder={t("Search...")}
      />
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
          {t("Add User")}
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
            {customerData ? (
              <>
                {Swal.fire({
                  title: t("Your Redirect To Login Page..."),
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false
                })}
                <Alert color="success">{t("Customer Successfully Updated")}</Alert>
              </>
            ) : null}
            <Row className="gy-4">
              <Col xxl={12} md={12}>
                <div>
                  <Input
                    type="hidden"
                    className="form-control"
                    id="userId"
                    name="userId"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.userId || ""}
                    invalid={
                      validation.touched.userId && validation.errors.userId
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="first_name" className="form-label">
                    {t("Fist Name")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ""}
                    invalid={
                      validation.touched.first_name &&
                      validation.errors.first_name
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="last_name" className="form-label">
                    {t("Last Name")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.last_name || ""}
                    invalid={
                      validation.touched.last_name &&
                      validation.errors.last_name
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="phone" className="form-label">
                    {t("Phone")}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.phone || ""}
                    invalid={
                      validation.touched.phone && validation.errors.phone
                        ? true
                        : false
                    }
                  />
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="email" className="form-label">
                    {t("Email")}
                  </Label>
                  <div className="form-icon">
                    <Input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={
                        validation.touched.email && validation.errors.email
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="dateOfBirth" className="form-label">
                    {t("Date of Birth")}
                  </Label>
                  <div className="form-icon">
                    <Input
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dateOfBirth || ""}
                      invalid={
                        validation.touched.dateOfBirth &&
                        validation.errors.dateOfBirth
                          ? true
                          : false
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col xxl={12} md={12}>
                <div>
                  <Label htmlFor="gender" className="form-label">
                    {t("Select Gender")}
                  </Label>
                  <Input
                    type="select"
                    name="gender"
                    id="gender"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gender || ""}
                    invalid={
                      validation.touched.gender && !!validation.errors.gender
                    }
                  >
                    <option value="">{t("Select Gender")}</option>
                    <option value={"MALE"}>
                      {t("Male")}
                    </option>
                    <option value={"FEMALE"}>
                      {t("Female")}
                    </option>
                  </Input>

                  {validation.touched.gender && validation.errors.gender ? (
                    <FormFeedback>{validation.errors.gender}</FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Button
              type={"submit"}
              id="update-customer-btn"
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
              document.getElementById("update-customer-btn")?.click();
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
            {t("Are you sure you want to delete this customer? This action cannot be undone.")}
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
              handleFilter(deleteCustomerId);
              handleDelete(deleteCustomerId);
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
