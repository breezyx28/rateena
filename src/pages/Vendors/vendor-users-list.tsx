import React, { useMemo, useState, useEffect } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { useTranslation } from "react-i18next";

const VendorUsersList = ({
  data,
  onEditUser,
  onDeleteUser,
}: {
  data: any[];
  onEditUser?: (user: any) => void;
  onDeleteUser?: (userId: number) => void;
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any[]>([]);

  useEffect(() => {
    if (data?.length > 0) {
      setFilter(data);
    }
  }, [data]);

  const handleFilter = (value: any) => {
    let results = filter.filter((item: any) => item.userId != value);
    if (results) {
      setFilter(results);
    }
  };

  const handleDelete = (userId: number) => {
    if (onDeleteUser) {
      onDeleteUser(userId);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("ID"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "userId",
        enableColumnFilter: false,
      },
      {
        header: t("Email"),
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: t("Phone"),
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          const row = cell.row.original; // full row data
          return (
            <div className="d-flex gap-3">
              <div
                style={{ cursor: "pointer" }}
                className="link-primary"
                onClick={() => {
                  if (onEditUser) {
                    onEditUser(row);
                  }
                }}
              >
                <i className="ri-settings-4-line"></i>
              </div>
              <div
                style={{ cursor: "pointer" }}
                className="link-danger"
                onClick={() => {
                  handleDelete(row.userId);
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
    []
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

export { VendorUsersList };
