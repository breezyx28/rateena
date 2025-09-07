import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { useTranslation } from "react-i18next";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { imgURL } from "services/api-handles";
import EditProductModal from "./modals/edit-product-modal";
import DeleteConfirmationModal from "./modals/delete-confirmation-modal";
import {
  toggleProductApproveQuery,
  toggleProductPublishQuery,
} from "slices/thunks";
import { useDispatch } from "react-redux";

const ProductsList = ({ data }: { data: any[] }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [publishFilter, setPublishFilter] = useState("all");
  const navigate = useNavigate();

  const dispatch: any = useDispatch();

  useEffect(() => {
    if (data?.length > 0) {
      setFilter(data);
    }
  }, [data]);

  useEffect(() => {
    let filteredData = data;

    if (approvalFilter !== "all") {
      filteredData = filteredData.filter(
        (product) => product.is_approved === (approvalFilter === "approved")
      );
    }

    if (publishFilter !== "all") {
      filteredData = filteredData.filter(
        (product) => product.published === (publishFilter === "published")
      );
    }

    setFilter(filteredData);
  }, [data, approvalFilter, publishFilter]);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    toggleEditModal();
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    toggleDeleteModal();
  };

  const confirmDelete = () => {
    toggleDeleteModal();
  };

  const handleTogglePublish = (product: any) => {
    // Optimistic UI update
    setFilter((prevFilter) =>
      prevFilter.map((item) =>
        item.productId === product.productId
          ? { ...item, published: !item.published }
          : item
      )
    );

    // Dispatch the action
    dispatch(toggleProductPublishQuery(product.productId));
  };

  const handleToggleApprove = (product: any) => {
    // Optimistic UI update
    setFilter((prevFilter) =>
      prevFilter.map((item) =>
        item.productId === product.productId
          ? { ...item, is_approved: !item.is_approved }
          : item
      )
    );

    // Dispatch the action
    dispatch(toggleProductApproveQuery(product.productId));
  };

  const columns = useMemo(
    () => [
      {
        header: t("ID"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "productId",
        enableColumnFilter: false,
      },
      {
        header: t("Image"),
        accessorKey: "images",
        cell: (cell: any) => {
          return (
            <div className="d-flex gap-2 align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={imgURL + "/" + cell.getValue()[0]}
                  alt=""
                  className="avatar-xs rounded-circle"
                />
              </div>
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: t("Name"),
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: t("Arabic Name"),
        accessorKey: "arName",
        enableColumnFilter: false,
      },
      {
        header: t("Quantity"),
        accessorKey: "quantity",
        enableColumnFilter: false,
      },
      {
        header: t("Price"),
        accessorKey: "finalPrice",
        enableColumnFilter: false,
      },
      {
        header: t("Approved"),
        accessorKey: "is_approved",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <FormGroup switch className="mb-0">
              <Input
                type="switch"
                checked={cell.getValue() || false}
                onChange={() => handleToggleApprove(cell.row.original)}
                title={cell.getValue() ? t("Approved") : t("Not Approved")}
              />
              <Label check></Label>
            </FormGroup>
          );
        },
      },
      {
        header: t("Published"),
        accessorKey: "published",
        enableColumnFilter: false,
        cell: (cell: any) => {
          let row = cell.row.original;
          return (
            <FormGroup switch className="mb-0">
              <Input
                type="switch"
                checked={cell.getValue() || false}
                onChange={() => handleTogglePublish(row)}
                title={cell.getValue() ? t("Unpublish") : t("Publish")}
              />
              <Label check={cell.getValue()}></Label>
            </FormGroup>
          );
        },
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleEdit(row)}
                title={t("Edit Product")}
              >
                <i className="ri-edit-line"></i>
              </button>

              <Link
                to={"product/" + row.productId}
                className="btn btn-sm btn-outline-info"
                title={t("View Product")}
              >
                <i className="ri-eye-line"></i>
              </Link>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(row)}
                title={t("Delete Product")}
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    [t, handleToggleApprove, handleTogglePublish]
  );

  const handleApprovalFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setApprovalFilter(e.target.value);
  };

  const handlePublishFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPublishFilter(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-start my-3 gap-3">
        <FormGroup>
          <Label htmlFor="approvalFilter">{t("Select Approval Status")}</Label>
          <select
            id="approvalFilter"
            className="form-control"
            value={approvalFilter}
            onChange={handleApprovalFilterChange}
          >
            <option value="all">{t("All")}</option>
            <option value="approved">{t("Approved")}</option>
            <option value="not_approved">{t("Not Approved")}</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="publishFilter">{t("Select Publish Status")}</Label>
          <select
            id="publishFilter"
            className="form-control"
            value={publishFilter}
            onChange={handlePublishFilterChange}
          >
            <option value="all">{t("All")}</option>
            <option value="published">{t("Published")}</option>
            <option value="unpublished">{t("Unpublished")}</option>
          </select>
        </FormGroup>
      </div>

      <TableContainer
        columns={columns || []}
        data={filter || []}
        isGlobalFilter={true}
        customPageSize={5}
        SearchPlaceholder={t("Search...")}
      />

      {data?.length > 0 ? (
        <EditProductModal
          modal_standard={editModal}
          tog_standard={toggleEditModal}
          productData={selectedProduct}
        />
      ) : null}

      {data?.length > 0 ? (
        <DeleteConfirmationModal
          modal_standard={deleteModal}
          tog_standard={toggleDeleteModal}
          onConfirm={confirmDelete}
          productName={selectedProduct?.name || ""}
        />
      ) : null}
    </React.Fragment>
  );
};

export { ProductsList };
