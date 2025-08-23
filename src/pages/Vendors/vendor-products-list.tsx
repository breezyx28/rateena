import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { imgURL } from "services/api-handles";

const VendorProductsList = ({ data }: { data: any[] }) => {
  const [filter, setFilter] = useState<any[]>(data || []);

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
        header: "Price",
        accessorKey: "finalPrice",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: any) => {
          const row = cell.row.original; // full row data
          return (
            <div className="text-start">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <span className="lh-1 align-middle link-secondary">
                    <i className="las la-share-square"></i>
                  </span>
                </li>

                <li
                  className="list-inline-item"
                  onClick={() => handleFilter(row.category.categoryId)}
                >
                  <span className="lh-1 align-middle link-danger">
                    <i className="las la-trash-alt"></i>
                  </span>
                </li>

                <li className="list-inline-item">
                  <span className="lh-1 align-middle link-danger">
                    <i className="las la-users"></i>
                  </span>
                </li>
              </ul>
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
    </React.Fragment>
  );
};

export { VendorProductsList };
