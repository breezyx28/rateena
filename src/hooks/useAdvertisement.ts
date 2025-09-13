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
      console.log("Axios error:", error.response?.data || error.message);
      
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

interface AdvertisementData {
  AdvertisementPayload: any;
  adsImage1?: File | null;
}

interface UseAdvertisementReturn {
  submit: (data: AdvertisementData) => Promise<void>;
  data: any;
  error: any;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  reset: () => void;
}

export const useAdvertisement = (): UseAdvertisementReturn => {
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

  const submit = useCallback(async (advertisementData: AdvertisementData) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const formData = new FormData();

      // Add AdvertisementPayload as JSON string
      formData.append(
        "AdvertisementPayload",
        JSON.stringify(advertisementData.AdvertisementPayload)
      );

      // Add image if provided
      if (advertisementData.adsImage1) {
        formData.append("adsImage1", advertisementData.adsImage1);
      }

      console.log("FormData contents:", {
        AdvertisementPayload: advertisementData.AdvertisementPayload,
        hasImage: !!advertisementData.adsImage1,
        imageName: advertisementData.adsImage1?.name,
      });

      const response = await axiosInstance.post(
        "/advertisements/save",
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
      console.log("Advertisement API Error: ", err);
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

// Hook for getting advertisements list
export const useAdvertisementsList = () => {
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

  const fetchAdvertisements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.get("/advertisements");
      setData(response.data);
      setIsSuccess(true);
      setIsError(false);
    } catch (err: any) {
      console.log("Advertisements List API Error: ", err);
      setError(err.response?.data || err.message);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchAdvertisements,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for getting single advertisement
export const useAdvertisementDetail = () => {
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

  const fetchAdvertisement = useCallback(
    async (advertisementId: string | number) => {
      setIsLoading(true);
      setError(null);
      setIsError(false);
      setIsSuccess(false);

      try {
        const response = await axiosInstance.get(
          `/advertisements/${advertisementId}`
        );
        setData(response.data);
        setIsSuccess(true);
        setIsError(false);
      } catch (err: any) {
        console.log("Advertisement Detail API Error: ", err);
        setError(err.response?.data || err.message);
        setIsError(true);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    fetchAdvertisement,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for deleting advertisement
export const useDeleteAdvertisement = () => {
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

  const deleteAdvertisement = useCallback(
    async (advertisementId: string | number) => {
      setIsLoading(true);
      setError(null);
      setIsError(false);
      setIsSuccess(false);

      try {
        const response = await axiosInstance.delete(
          `/advertisements/delete/${advertisementId}`
        );
        setData(response.data);
        setIsSuccess(true);
        setIsError(false);
      } catch (err: any) {
        console.log("Delete Advertisement API Error: ", err);
        setError(err.response?.data || err.message);
        setIsError(true);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    deleteAdvertisement,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for toggling advertisement
export const useToggleAdvertisement = () => {
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

  const toggleAdvertisement = useCallback(
    async (advertisementId: string | number) => {
      setIsLoading(true);
      setError(null);
      setIsError(false);
      setIsSuccess(false);

      try {
        const response = await axiosInstance.get(
          `/advertisements/toggle/showing/${advertisementId}`
        );
        setData(response.data);
        setIsSuccess(true);
        setIsError(false);
      } catch (err: any) {
        console.log("Toggle Advertisement API Error: ", err);
        setError(err.response?.data || err.message);
        setIsError(true);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    toggleAdvertisement,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};
