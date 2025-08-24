/**
 * Utility functions for handling and formatting API errors
 */

export interface ApiError {
  message?: string;
  status?: number;
  statusText?: string;
  data?: any;
  errors?: any;
  fullError?: any;
  config?: any;
  url?: string;
  method?: string;
}

/**
 * Formats error messages from API responses
 * @param error - The error object from the API
 * @returns Formatted error message string
 */
export const formatErrorMessage = (error: ApiError | any): string => {
  if (!error) {
    return "An unknown error occurred";
  }

  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If it has a message property, use it
  if (error.message) {
    return error.message;
  }

  // If it has errors object (Laravel validation errors)
  if (error.errors && typeof error.errors === "object") {
    const errorMessages = Object.values(error.errors).flat();
    return Array.isArray(errorMessages)
      ? errorMessages.join(", ")
      : String(errorMessages);
  }

  // If it has data with message
  if (error.data?.message) {
    return error.data.message;
  }

  // If it has data with errors
  if (error.data?.errors && typeof error.data.errors === "object") {
    const errorMessages = Object.values(error.data.errors).flat();
    return Array.isArray(errorMessages)
      ? errorMessages.join(", ")
      : String(errorMessages);
  }

  // Fallback to status text or generic message
  if (error.statusText) {
    return error.statusText;
  }

  return "An error occurred while processing your request";
};

/**
 * Extracts detailed error information for debugging
 * @param error - The error object from the API
 * @returns Object with detailed error information
 */
export const getErrorDetails = (error: ApiError | any): any => {
  if (!error) {
    return { message: "No error provided" };
  }

  return {
    message: error.message,
    status: error.status,
    statusText: error.statusText,
    data: error.data,
    errors: error.errors,
    url: error.url || error.config?.url,
    method: error.method || error.config?.method,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Checks if the error is a validation error (422 status)
 * @param error - The error object from the API
 * @returns boolean indicating if it's a validation error
 */
export const isValidationError = (error: ApiError | any): boolean => {
  return error?.status === 422 || error?.data?.status === 422;
};

/**
 * Checks if the error is an authentication error (401 status)
 * @param error - The error object from the API
 * @returns boolean indicating if it's an authentication error
 */
export const isAuthError = (error: ApiError | any): boolean => {
  return error?.status === 401 || error?.data?.status === 401;
};

/**
 * Checks if the error is a server error (5xx status)
 * @param error - The error object from the API
 * @returns boolean indicating if it's a server error
 */
export const isServerError = (error: ApiError | any): boolean => {
  const status = error?.status || error?.data?.status;
  return status >= 500 && status < 600;
};

/**
 * Logs error details for debugging purposes
 * @param error - The error object from the API
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: ApiError | any, context?: string): void => {
  const errorDetails = getErrorDetails(error);
  const formattedMessage = formatErrorMessage(error);

  console.group(`🚨 API Error${context ? ` - ${context}` : ""}`);
  console.error("Formatted Message:", formattedMessage);
  console.error("Error Details:", errorDetails);
  console.error("Full Error Object:", error);
  console.groupEnd();
};

/**
 * Creates a user-friendly error message based on error type
 * @param error - The error object from the API
 * @returns User-friendly error message
 */
export const getUserFriendlyMessage = (error: ApiError | any): string => {
  if (isValidationError(error)) {
    return (
      "Please check your input and try again. " + formatErrorMessage(error)
    );
  }

  if (isAuthError(error)) {
    return "Your session has expired. Please log in again.";
  }

  if (isServerError(error)) {
    return "We're experiencing technical difficulties. Please try again later.";
  }

  return formatErrorMessage(error);
};

/**
 * Error toast manager to prevent duplicate error toasts
 */
class ErrorToastManager {
  private static instance: ErrorToastManager;
  private lastError: string | null = null;
  private lastErrorTime: number = 0;
  private readonly DEBOUNCE_TIME = 2000; // 2 seconds

  static getInstance(): ErrorToastManager {
    if (!ErrorToastManager.instance) {
      ErrorToastManager.instance = new ErrorToastManager();
    }
    return ErrorToastManager.instance;
  }

  showError(error: ApiError | any, toastFunction: any): void {
    const errorMessage = formatErrorMessage(error);
    const currentTime = Date.now();

    // Check if this is the same error within the debounce time
    if (
      this.lastError === errorMessage &&
      currentTime - this.lastErrorTime < this.DEBOUNCE_TIME
    ) {
      return; // Don't show duplicate error
    }

    // Update last error info
    this.lastError = errorMessage;
    this.lastErrorTime = currentTime;

    // Show the error toast
    toastFunction(errorMessage);
  }

  clearLastError(): void {
    this.lastError = null;
    this.lastErrorTime = 0;
  }
}

export const errorToastManager = ErrorToastManager.getInstance();

/**
 * Maps server errors to Formik field errors
 * @param serverErrors - The server error object containing validation errors
 * @param setErrors - Formik's setErrors function
 * @param fieldMapping - Optional mapping object to map server field names to form field names
 */
export const mapServerErrorsToFormik = (
  serverErrors: any,
  setErrors: (errors: any) => void,
  fieldMapping?: Record<string, string>
) => {
  const fieldErrors: any = {};
  if (serverErrors?.errors) {
    Object.keys(serverErrors.errors).forEach((field) => {
      const fieldName = fieldMapping?.[field] || field;
      fieldErrors[fieldName] = serverErrors.errors[field][0];
    });
  }

  setErrors(fieldErrors);
};
