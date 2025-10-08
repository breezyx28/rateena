import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import config from "../config";

const { api } = config;

// Helper function to get current language
const getCurrentLanguage = () => {
  const currentLang = localStorage.getItem("I18N_LANGUAGE") || "en";
  return currentLang === "ar" ? "ar" : "en";
};

// Helper function to get auth token
const getAuthToken = () => {
  const authUser: any = sessionStorage.getItem("authUser");
  return JSON.parse(authUser) ? JSON.parse(authUser).accessToken : null;
};

// Create axios instance with default config
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: api.API_URL,
    timeout: 30000,
  });

  // Request interceptor to add auth and language headers
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["Accept-Language"] = getCurrentLanguage();
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        sessionStorage.removeItem("authUser");
        window.location.replace("/login");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

interface VendorData {
  VendorPayload: any;
  licenseImage?: File | null;
  identityImage?: File | null;
  profileImage?: File | null;
  coverImage?: File | null;
}

interface UseVendorReturn {
  submit: (data: VendorData) => Promise<void>;
  data: any;
  error: any;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  reset: () => void;
}

export const useVendor = (): UseVendorReturn => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSuccess(false);
    setIsError(false);
    setIsLoading(false);
  }, []);

  const submit = useCallback(async (vendorData: VendorData) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const formData = new FormData();

      // Add VendorPayload as JSON string
      formData.append(
        "VendorPayload",
        JSON.stringify(vendorData.VendorPayload)
      );

      // Add images if provided
      if (vendorData.licenseImage) {
        formData.append("licenseImage", vendorData.licenseImage);
      }
      if (vendorData.identityImage) {
        formData.append("identityImage", vendorData.identityImage);
      }
      if (vendorData.profileImage) {
        formData.append("profileImage", vendorData.profileImage);
      }
      if (vendorData.coverImage) {
        formData.append("coverImage", vendorData.coverImage);
      }

      const response = await axiosInstance.post(
        "/vendors/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(response.data);
      setIsSuccess(true);
      setIsError(false);
    } catch (err: any) {
      setError(err.response?.data || err.message);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    submit,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};