import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { imgURL } from "services/api-handles";
import EditProductModal from "./modals/edit-product-modal";
import DeleteConfirmationModal from "./modals/delete-confirmation-modal";

const VendorProductsList = ({ data }: { data: any[] }) => {
  const [filter, setFilter] = useState<any[]>(data || []);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setFilter(data);
    }
  }, [data]);

  const handleFilter = (value: any) => {
    let results = filter.filter(
      (item: any) => item.category.categoryId != value
    );

    if (results) {
      setFilter(results);
    }
  };

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    toggleEditModal();
  };

  const handleView = (productId: string) => {
    navigate(`/vendor-product/${productId}`);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    toggleDeleteModal();
  };

  const confirmDelete = () => {
    console.log("Deleting product:", selectedProduct);
    // dispatch(deleteVendorProductMutation(selectedProduct.productId));
    toggleDeleteModal();
  };

  const handleTogglePublish = (product: any) => {
    console.log("Toggling publish status:", product);
    // dispatch(toggleProductPublishMutation(product.productId, !product.isPublished));
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "productId",
        enableColumnFilter: false,
      },
      {
        header: "Image",
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
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Arabic Name",
        accessorKey: "arName",
        enableColumnFilter: false,
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        enableColumnFilter: false,
      },
      {
        header: "Price",
        accessorKey: "finalPrice",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: any) => {
          const row = cell.row.original;
          return (
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleEdit(row)}
                title="Edit Product"
              >
                <i className="ri-edit-line"></i>
              </button>

              <Link
                to={"product/" + row.productId}
                className="btn btn-sm btn-outline-info"
                // onClick={() => handleView(row.productId)}
                title="View Product"
              >
                <i className="ri-eye-line"></i>
              </Link>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(row)}
                title="Delete Product"
              >
                <i className="ri-delete-bin-line"></i>
              </button>

              <FormGroup switch className="mb-0">
                <Input
                  type="switch"
                  checked={row.published || false}
                  onChange={() => handleTogglePublish(row)}
                  title={row.published ? "Unpublish" : "Publish"}
                />
                <Label check></Label>
              </FormGroup>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <TableContainer
        columns={columns || []}
        data={filter || []}
        isGlobalFilter={true}
        customPageSize={5}
        SearchPlaceholder="Search..."
      />

      <EditProductModal
        modal_standard={editModal}
        tog_standard={toggleEditModal}
        productData={selectedProduct}
      />

      <DeleteConfirmationModal
        modal_standard={deleteModal}
        tog_standard={toggleDeleteModal}
        onConfirm={confirmDelete}
        productName={selectedProduct?.name || ""}
      />
    </React.Fragment>
  );
};

export { VendorProductsList };
