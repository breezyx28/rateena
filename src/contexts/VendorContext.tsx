import React, { createContext, useContext, ReactNode } from "react";
import { useVendorState } from "../hooks/useVendorState";

interface VendorContextType {
  vendorInfo: any;
  vendorState: any;
  selectedCoords: { lat: number; lng: number } | undefined;
  vendorError: any;
  vendorData: any;
  setVendorInfo: (info: any) => void;
  setSelectedCoords: (coords: { lat: number; lng: number } | undefined) => void;
  toggleVendorStatus: (vendorId: string, currentStatus: boolean) => void;
  handleProfileImageUpload: (event: any, userId: any) => void;
  handleCoverImageUpload: (event: any, userId: any) => void;
  getCurrentVendorStatus: () => boolean | null;
  getCurrentVendorStatusText: () => string;
  dispatch: any;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

interface VendorProviderProps {
  children: ReactNode;
  vendorId: string;
  initialVendorInfo?: any;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({
  children,
  vendorId,
  initialVendorInfo = {},
}) => {
  const vendorState = useVendorState({
    vendorId,
    initialVendorInfo,
  });

  return (
    <VendorContext.Provider value={vendorState}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendorContext = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error("useVendorContext must be used within a VendorProvider");
  }
  return context;
};
