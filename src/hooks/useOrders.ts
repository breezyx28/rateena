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

interface UseOrderStatusReturn {
  changeStatus: (orderId: string | number, status: string) => Promise<void>;
  data: any;
  error: any;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  reset: () => void;
}

export const useOrderStatus = (): UseOrderStatusReturn => {
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

  const changeStatus = useCallback(async (orderId: string | number, status: string) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.get(
        `/orders/change/status/${orderId}?status=${status}`
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
    changeStatus,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for getting orders list
export const useOrdersList = () => {
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

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.get("/orders");
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
    fetchOrders,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for getting single order
export const useOrderDetail = () => {
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

  const fetchOrder = useCallback(async (orderId: string | number) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
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
    fetchOrder,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};

// Hook for getting order invoice
export const useOrderInvoice = () => {
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

  const fetchInvoice = useCallback(async (orderId: string | number) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axiosInstance.get(`/invoices/order/${orderId}`);
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
    fetchInvoice,
    data,
    error,
    isSuccess,
    isError,
    isLoading,
    reset,
  };
};