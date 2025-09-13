import { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAdvertisement } from "./useAdvertisement";

// Validation schema from AdvertisementsList.tsx
const createValidationSchema = (isEdit: boolean = false) => {
  return Yup.object().shape({
    title: Yup.string(),
    arTitle: Yup.string(),
    subtitle: Yup.string(),
    arSubtitle: Yup.string(),
    startDate: Yup.date(),
    expireDate: Yup.date(),
    startTime: Yup.string(),
    endTime: Yup.string(),
    url: Yup.string()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .url("Must be a valid URL")
      .notRequired()
      .nullable(),
    banner: Yup.string().required("Banner type is required"),
    priority: Yup.number()
      .nullable()
      .when("banner", {
        is: (val: string) => val !== "External Advertisements",
        then: (schema) => schema.required("Priority is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    vendorId: Yup.string().when("banner", {
      is: (val: string) => val !== "External Advertisements",
      then: (schema) => schema.required("Vendor is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    replacePriority: Yup.mixed()
      .transform((value, originalValue) => {
        // Handle boolean values - convert true to null, false to null
        if (typeof originalValue === 'boolean') {
          return null;
        }
        // Handle empty string
        if (originalValue === '' || originalValue === undefined) {
          return null;
        }
        // Convert to number if it's a valid number
        const num = Number(originalValue);
        return isNaN(num) ? null : num;
      })
      .nullable(),
  });
};

interface UseAdvertisementWithValidationProps {
  initialValues?: any;
  isEdit?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseAdvertisementWithValidationReturn {
  formik: any;
  submit: () => void;
  data: any;
  error: any;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  reset: () => void;
  setServerErrors: (errors: any) => void;
}

export const useAdvertisementWithValidation = ({
  initialValues = {
    title: "",
    arTitle: "",
    subtitle: "",
    arSubtitle: "",
    startDate: "",
    expireDate: "",
    startTime: "",
    endTime: "",
    url: "",
    banner: "",
    priority: null,
    vendorId: "",
    replacePriority: null,
  },
  isEdit = false,
  onSuccess,
  onError,
}: UseAdvertisementWithValidationProps = {}): UseAdvertisementWithValidationReturn => {
  const advertisementHook = useAdvertisement();
  const [serverErrors, setServerErrors] = useState<any>(null);

  // Normalize time to HH:mm:ss helper function
  const normalizeTimeToHms = (timeString: string) => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) return timeString;
    if (/^\d{2}:\d{2}$/.test(timeString)) return `${timeString}:00`;
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    } catch {
      return timeString;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: createValidationSchema(isEdit),
    onSubmit: async (values) => {
      console.log("Form submission started with values:", values);
      console.log("Formik errors:", formik.errors);
      console.log("Formik touched:", formik.touched);
      console.log("Formik isValid:", formik.isValid);
      
      // Clear any previous server error
      formik.setStatus(undefined);
      setServerErrors(null);

      const normalizedValues = {
        ...values,
        // Null vendorId when external advertisement type is selected
        vendorId:
          values.banner === "External Advertisements" ? null : values.vendorId,
        startTime: normalizeTimeToHms(values.startTime as any),
        endTime: normalizeTimeToHms(values.endTime as any),
      };

      const payload = {
        AdvertisementPayload: normalizedValues,
        adsImage1: values.adsImage1 || null,
      };

      try {
        await advertisementHook.submit(payload);
      } catch (error) {
        // Error handling is done in the hook
        console.log("ads-hook-submit-errors: ", error);
      }
    },
  });

  // Handle server errors and map them to formik field errors
  useEffect(() => {
    if (advertisementHook.error) {
      const serverMessage = advertisementHook.error?.message;
      const serverErrors = advertisementHook.error?.errors || {};

      // Set server error in formik status
      formik.setStatus({ serverError: serverMessage });

      // Map server errors to formik field errors
      if (serverErrors && typeof serverErrors === "object") {
        Object.entries(serverErrors).forEach(([key, value]) => {
          const firstMessage = Array.isArray(value)
            ? String(value[0])
            : String(value);

          // Only map to known fields; otherwise keep it as server status
          if (key in formik.values) {
            formik.setFieldError(key as any, firstMessage);
          }
        });
      }

      setServerErrors(serverErrors);
      onError?.(advertisementHook.error);
    }
  }, [advertisementHook.error]);

  // Handle success
  useEffect(() => {
    if (advertisementHook.isSuccess) {
      onSuccess?.(advertisementHook.data);
    }
  }, [advertisementHook.isSuccess, advertisementHook.data]);

  const submit = useCallback(() => {
    console.log("Submit function called");
    console.log("Current formik state:", {
      values: formik.values,
      errors: formik.errors,
      touched: formik.touched,
      isValid: formik.isValid,
      isSubmitting: formik.isSubmitting,
    });
    
    // Validate manually to see validation errors
    formik.validateForm().then((errors) => {
      console.log("Manual validation errors:", errors);
      if (Object.keys(errors).length > 0) {
        console.log("Validation failed, form will not submit");
      } else {
        console.log("Validation passed, form should submit");
      }
    });
    
    formik.handleSubmit();
  }, [formik]);

  const reset = useCallback(() => {
    advertisementHook.reset();
    formik.resetForm();
    setServerErrors(null);
  }, [advertisementHook.reset, formik]);

  return {
    formik,
    submit,
    data: advertisementHook.data,
    error: advertisementHook.error,
    isSuccess: advertisementHook.isSuccess,
    isError: advertisementHook.isError,
    isLoading: advertisementHook.isLoading,
    reset,
    setServerErrors,
  };
};
