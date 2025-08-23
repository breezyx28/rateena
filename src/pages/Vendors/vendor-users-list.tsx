import React, { useMemo, useState, useEffect } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";

const VendorUsersList = ({ data }: { data: any[] }) => {
  const [filter, setFilter] = useState<any[]>(data || []);

  useEffect(() => {
    if (data) {
      setFilter(data);
    }
  }, [data]);

  const handleFilter = (value: any) => {
    let results = filter.filter((item: any) => item.userId != value);

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
        accessorKey: "userId",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone",
        accessorKey: "phone",
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
                  onClick={() => handleFilter(row.userId)}
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

export { VendorUsersList };
