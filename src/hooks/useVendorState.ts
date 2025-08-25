import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getVendor,
  addVendorMutation,
  toggleVendorStateQuery,
} from "slices/thunks";
import { clearVendorError } from "slices/vendors/reducer";
import { toast } from "react-toastify";
import { formatErrorMessage, errorToastManager } from "helpers/error-helper";

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
      // Use error toast manager to prevent duplicate toasts
      errorToastManager.showError(vendorError, toast.error);
      setVendorState({
        currentState: null,
        vendorId: null,
      });
    }
  }, [vendorError]);

  // Toggle vendor working status
  const toggleVendorStatus = (vendorId: string, currentStatus: boolean) => {
    dispatch(toggleVendorStateQuery(vendorId));
    setVendorState({
      vendorId,
      currentState: !currentStatus,
    });
    toast.success(`Vendor status updated successfully!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle profile image upload
  const handleProfileImageUpload = (event: any, userId: any) => {
    const file = event.target?.files[0];
    if (file) {
      console.log("file: ", file);

      const formData = new FormData();
      formData.append("profileImage", file);

      // Create VendorPayload object with correct field mapping
      const vendorPayload: any = {
        vendorId: vendorId ?? null,
        userId: userId ?? null,
      };

      // Add VendorPayload as JSON string
      formData.append("VendorPayload", JSON.stringify(vendorPayload));

      dispatch(addVendorMutation(formData));

      // toast.success("Profile image updated successfully!", {
      //   position: "top-right",
      //   autoClose: 2000,
      // });
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (event: any, userId: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("coverImage", file);

      // Create VendorPayload object with correct field mapping
      const vendorPayload: any = {
        vendorId: vendorId ?? null,
        userId: userId ?? null,
      };

      // Add VendorPayload as JSON string
      formData.append("VendorPayload", JSON.stringify(vendorPayload));

      dispatch(addVendorMutation(formData));

      toast.success("Cover image updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
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
