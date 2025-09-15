import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getVendor,
  addVendorMutation,
  toggleVendorStateQuery,
} from "slices/thunks";
import { clearVendorError } from "slices/vendors/reducer";
import Swal from "sweetalert2";
import { formatErrorMessage, errorToastManager } from "helpers/error-helper";
import { useTranslation } from "react-i18next";

interface UseVendorStateProps {
  vendorId: string;
  initialVendorInfo?: any;
}

interface VendorState {
  currentState: null | boolean;
  vendorId: null | string | number;
}

export const useVendorState = ({
  vendorId,
  initialVendorInfo = {},
}: UseVendorStateProps) => {
  const dispatch: any = useDispatch();
  const { t } = useTranslation();

  // Vendor state management
  const [vendorInfo, setVendorInfo] = useState(initialVendorInfo);
  const [vendorState, setVendorState] = useState<VendorState>({
    currentState: null,
    vendorId: null,
  });
  const [selectedCoords, setSelectedCoords] = useState<
    { lat: number; lng: number } | undefined
  >();

  // Redux selectors
  const selectLayoutState = (state: any) => state.Vendors;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    vendorError: state.vendorError,
    vendorData: state.vendorData,
    vendorUpdatedSuccess: state.vendorUpdatedSuccess,
  }));

  const { vendorError, vendorData, vendorUpdatedSuccess } = useSelector(
    selectLayoutProperties
  );

  // Fetch vendor data
  useEffect(() => {
    if (vendorId) {
      dispatch(getVendor(vendorId));
    }
  }, [dispatch, vendorId]);

  // Update vendor info when data changes
  useEffect(() => {
    if (vendorData?.vendor && vendorData.vendor !== vendorInfo) {
      setVendorInfo(vendorData.vendor);
    }
  }, [vendorData, vendorInfo]);

  // Handle vendor errors
  useEffect(() => {
    if (vendorError) {
      Swal.fire({
        icon: "error",
        title: t("Error!"),
        text: vendorError?.message || t("An error occurred"),
        confirmButtonText: t("OK"),
      });
      setVendorState({
        currentState: null,
        vendorId: null,
      });
    }
  }, [vendorError, t]);

  // Toggle vendor working status
  const toggleVendorStatus = async (vendorId: string, currentStatus: boolean) => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t(`Do you want to ${currentStatus ? 'deactivate' : 'activate'} this vendor?`),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Yes, Update Status"),
      cancelButtonText: t("Cancel"),
    });

    if (result.isConfirmed) {
      try {
        dispatch(toggleVendorStateQuery(vendorId));
        setVendorState({
          vendorId,
          currentState: !currentStatus,
        });
        Swal.fire({
          icon: "success",
          title: t("Success!"),
          text: t("Vendor status updated successfully!"),
          confirmButtonText: t("OK"),
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("Error!"),
          text: t("Failed to update vendor status"),
          confirmButtonText: t("OK"),
        });
      }
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (event: any, userId: any) => {
    const file = event.target?.files[0];
    if (file) {
      const result = await Swal.fire({
        title: t("Are you sure?"),
        text: t("Do you want to update the profile image?"),
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("Yes, Update Image"),
        cancelButtonText: t("Cancel"),
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("profileImage", file);

          const vendorPayload: any = {
            vendorId: vendorId ?? null,
            userId: userId ?? null,
          };

          formData.append("VendorPayload", JSON.stringify(vendorPayload));
          dispatch(addVendorMutation(formData));

          Swal.fire({
            icon: "success",
            title: t("Success!"),
            text: t("Profile image updated successfully!"),
            confirmButtonText: t("OK"),
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: t("Error!"),
            text: t("Failed to update profile image"),
            confirmButtonText: t("OK"),
          });
        }
      }
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (event: any, userId: any) => {
    const file = event.target.files[0];
    if (file) {
      const result = await Swal.fire({
        title: t("Are you sure?"),
        text: t("Do you want to update the cover image?"),
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("Yes, Update Image"),
        cancelButtonText: t("Cancel"),
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("coverImage", file);

          const vendorPayload: any = {
            vendorId: vendorId ?? null,
            userId: userId ?? null,
          };

          formData.append("VendorPayload", JSON.stringify(vendorPayload));
          dispatch(addVendorMutation(formData));

          Swal.fire({
            icon: "success",
            title: t("Success!"),
            text: t("Cover image updated successfully!"),
            confirmButtonText: t("OK"),
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: t("Error!"),
            text: t("Failed to update cover image"),
            confirmButtonText: t("OK"),
          });
        }
      }
    }
  };

  // Get current vendor status
  const getCurrentVendorStatus = () => {
    return vendorState?.vendorId === vendorId
      ? vendorState?.currentState
      : vendorInfo?.working;
  };

  // Get current vendor status text
  const getCurrentVendorStatusText = () => {
    const status = getCurrentVendorStatus();
    return status ? "Active" : "Inactive";
  };

  return {
    // State
    vendorInfo,
    vendorState,
    selectedCoords,
    vendorError,
    vendorData,
    vendorUpdatedSuccess,

    // Setters
    setVendorInfo,
    setSelectedCoords,

    // Actions
    toggleVendorStatus,
    handleProfileImageUpload,
    handleCoverImageUpload,

    // Computed values
    getCurrentVendorStatus,
    getCurrentVendorStatusText,

    // Dispatch for custom actions
    dispatch,
  };
};
