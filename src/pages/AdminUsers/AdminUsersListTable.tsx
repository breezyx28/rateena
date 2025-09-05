import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import ResetPasswordModal from "./admin-users-modals/reset-password-modal";
import UpdateModal from "./admin-users-modals/update-modal";
import DeleteConfirmationModal from "./admin-users-modals/delete-confirmation-modal";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { deleteAdminUserMutation } from "slices/thunks";
import { useTranslation } from "react-i18next";

const AdminUsersListTable = ({ data }: { data: any[] }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any[]>(data || []);
  const [reset_password_modal_standard, setResetPasswordModalStandard] =
    useState<boolean>(false);
  const [update_user_modal_standard, setUpdateUserModalStandard] =
    useState<boolean>(false);
  const [
    delete_confirmation_modal_standard,
    setDeleteConfirmationModalStandard,
  ] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  console.log("data: ", data);

  function tog_resetPasswordModal() {
    setResetPasswordModalStandard(!reset_password_modal_standard);
  }
  function tog_updateUserModal() {
    setUpdateUserModalStandard(!update_user_modal_standard);
  }
  function tog_deleteConfirmationModal() {
    setDeleteConfirmationModalStandard(!delete_confirmation_modal_standard);
  }

  useEffect(() => {
    if (data) {
      setFilter(data);
    }
  }, [data]);

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    tog_deleteConfirmationModal();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      let results = filter.filter(
        (item: any) => item.userId != userToDelete.userId
      );

      if (results) {
        setFilter(results);
        dispatch(deleteAdminUserMutation(userToDelete.userId));
      }
      setUserToDelete(null);
    }
  };

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.AdminUsers;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    adminUsersError: state.adminUsersError,
    adminUsersListSuccess: state.adminUsersListSuccess,
  }));

  const { adminUsersError, adminUsersListSuccess } = useSelector(
    selectLayoutProperties
  );

  React.useEffect(() => {
    if (adminUsersListSuccess) {
      console.log("adminUsersListSuccess: ", adminUsersListSuccess);
    }
    if (adminUsersError) {
      console.log("adminUsersError: ", adminUsersError);
    }
  }, [adminUsersError, adminUsersListSuccess]);

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
        header: t("Phone"),
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: t("Email"),
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          const row = cell.row.original; // full row data
          return (
            <div className="text-start">
              <ul className="list-inline mb-0">
                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="list-inline-item"
                  onClick={() => tog_updateUserModal()}
                >
                  <span className="lh-1 align-middle link-secondary">
                    <i className="las la-pen"></i>
                  </span>
                </li>

                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="list-inline-item"
                  onClick={() => handleDeleteClick(row)}
                >
                  <span className="lh-1 align-middle link-danger">
                    <i className="las la-trash-alt"></i>
                  </span>
                </li>

                <li
                  style={{
                    cursor: "pointer",
                  }}
                  className="list-inline-item"
                  onClick={() => tog_resetPasswordModal()}
                >
                  <span className="lh-1 align-middle link-warning">
                    <i className="ri-key-line"></i>
                  </span>
                </li>
              </ul>
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
        data={filter}
        isGlobalFilter={true}
        customPageSize={5}
        SearchPlaceholder={t("Search...")}
      />
      <ResetPasswordModal
        modal_standard={reset_password_modal_standard}
        tog_standard={tog_resetPasswordModal}
      />
      <UpdateModal
        modal_standard={update_user_modal_standard}
        tog_standard={tog_updateUserModal}
      />
      <DeleteConfirmationModal
        modal_standard={delete_confirmation_modal_standard}
        tog_standard={tog_deleteConfirmationModal}
        onConfirm={handleConfirmDelete}
        userId={userToDelete?.userId}
        userName={userToDelete?.email || userToDelete?.phone}
      />
    </React.Fragment>
  );
};

export { AdminUsersListTable };
