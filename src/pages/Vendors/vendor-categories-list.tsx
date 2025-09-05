import React, { useMemo, useState, useEffect } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Badge } from "reactstrap";
import { useTranslation } from "react-i18next";

const VendorCategoriesList = ({
  data,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory,
}: {
  data: any[];
  onEditCategory?: (category: any) => void;
  onDeleteCategory?: (categoryId: number) => void;
  onToggleCategory?: (categoryId: number, currentStatus: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any[]>([]);

  useEffect(() => {
    if (data?.length > 0) {
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

  const handleDelete = (categoryId: number) => {
    if (onDeleteCategory) {
      onDeleteCategory(categoryId);
    }
  };

  const handleToggle = (categoryId: number, currentStatus: boolean) => {
    if (onToggleCategory) {
      onToggleCategory(categoryId, currentStatus);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("ID"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "category.categoryId",
        enableColumnFilter: false,
      },
      {
        header: t("English Name"),
        accessorKey: "category.name",
        enableColumnFilter: false,
      },
      {
        header: t("Arabic Name"),
        accessorKey: "category.arName",
        enableColumnFilter: false,
      },
      {
        header: t("Products"),
        accessorKey: "numberOfProducts",
        enableColumnFilter: false,
      },
      {
        header: t("Status"),
        cell: (cell: any) => {
          const row = cell.row.original;
          const isPublished = row.category?.published || false;
          return (
            <Badge
              color={isPublished ? "success" : "secondary"}
              className="badge-soft-success"
            >
              {isPublished ? t("Published") : t("Unpublished")}
            </Badge>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          const row = cell.row.original; // full row data
          const isPublished = row.category?.published || false;
          return (
            <div className="d-flex gap-3">
              <div
                style={{ cursor: "pointer" }}
                className="link-primary"
                onClick={() => {
                  if (onEditCategory) {
                    onEditCategory(row);
                  }
                }}
              >
                <i className="ri-edit-2-line"></i>
              </div>
              <div
                style={{ cursor: "pointer" }}
                className="link-danger"
                onClick={() => {
                  handleDelete(row.category.categoryId);
                }}
              >
                <i className="ri-delete-bin-5-line"></i>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={`toggle-${row.category.categoryId}`}
                  checked={isPublished}
                  onChange={() =>
                    handleToggle(row.category.categoryId, isPublished)
                  }
                />
              </div>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    [onEditCategory, onDeleteCategory, onToggleCategory]
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
    </React.Fragment>
  );
};

export { VendorCategoriesList };
