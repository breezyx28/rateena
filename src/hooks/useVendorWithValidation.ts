import { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { addVendorMutation } from "slices/thunks";
import { clearVendorError } from "slices/vendors/reducer";
import { t } from "i18next";

const createValidationSchema = (isEdit: boolean = false) => {
  return Yup.object().shape({
    fullName: Yup.string()
      .min(2, "English name must be at least 2 characters")
      .max(50, "English name must be less than 50 characters")
      .required("English name is required"),
    arFullName: Yup.string()
      .min(2, "Arabic name must be at least 2 characters")
      .max(50, "Arabic name must be less than 50 characters")
      .required("Arabic name is required"),
    userPhone: Yup.string()
      .matches(
        /^[0-9+\-\s()]+$/,
        "Phone number must contain only numbers, +, -, spaces, and parentheses"
      )
      .min(8, "Phone number must be at least 8 characters")
      .max(20, "Phone number must be less than 20 characters")
      .required("Phone number is required"),
    userEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().min(8).required("Password is required"),
    maxKilometerDelivery: Yup.number()
      .min(1, "Max kilometer delivery must be at least 1")
      .max(1000, "Max kilometer delivery must be less than 1000")
      .required("Max kilometer delivery is required")
      .typeError("Max kilometer delivery must be a number"),
    minChargeLongDistance: Yup.number()
      .min(0, "Min charge for long distance must be at least 0")
      .max(10000, "Min charge for long distance must be less than 10000")
      .required("Min charge for long distance is required")
      .typeError("Min charge for long distance must be a number"),
    always_open: Yup.boolean().required("Always open status is required"),
    openingTime: Yup.string().when("always_open", {
      is: false,
      then: (schema) => schema.required("Opening time is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    closingTime: Yup.string().when("always_open", {
      is: false,
      then: (schema) => schema.required("Closing time is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    region: Yup.string().required("Region is required"),
    vendorType: Yup.string().required("Vendor type is required"),
  });
};

interface UseVendorWithValidationProps {
  initialValues?: any;
  isEdit?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseVendorWithValidationReturn {
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

export const useVendorWithValidation = ({
  initialValues = {
    fullName: "",
    arFullName: "",
    userPhone: "",
    userEmail: "",
    password: "",
    maxKilometerDelivery: "",
    minChargeLongDistance: "",
    always_open: false,
    openingTime: "",
    closingTime: "",
    region: "",
    vendorType: "",
  },
  isEdit = false,
  onSuccess,
  onError,
}: UseVendorWithValidationProps = {}): UseVendorWithValidationReturn => {
  const dispatch: any = useDispatch();
  const [serverErrors, setServerErrors] = useState<any>(null);

  const selectVendorsLayoutState = (state: any) => state.Vendors;
  const selectVendorLayoutProperties = createSelector(
    selectVendorsLayoutState,
    (state) => ({
      vendorError: state.error,
      vendorSuccess: state.success,
      vendorUpdatedSuccess: state.vendorUpdatedSuccess,
    })
  );

  const { vendorError, vendorSuccess, vendorUpdatedSuccess } = useSelector(
    selectVendorLayoutProperties
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: createValidationSchema(isEdit),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Form submission started with values:", values);
      console.log("Formik errors:", formik.errors);

      formik.setStatus(undefined);
      setServerErrors(null);
      dispatch(clearVendorError());

      const vendorPayload: any = {
        fullName: values.fullName,
        arFullName: values.arFullName,
        phone: values.userPhone,
        email: values.userEmail,
        password: values.password,
        maxKilometerDelivery: parseInt(values.maxKilometerDelivery),
        openingTime: values.openingTime,
        closingTime: values.closingTime,
        region: values.region,
        vendorType: values.vendorType,
        always_open: values.always_open,
        minChargeLongDistance: parseInt(values.minChargeLongDistance),
      };

      const formData = new FormData();
      formData.append("VendorPayload", JSON.stringify(vendorPayload));

      if (values.licenseImageFile) {
        formData.append("licenseImage", values.licenseImageFile);
      }
      if (values.identityImageFile) {
        formData.append("identityImage", values.identityImageFile);
      }
      if (values.profileImageFile) {
        formData.append("profileImage", values.profileImageFile);
      }
      if (values.coverImageFile) {
        formData.append("coverImage", values.coverImageFile);
      }

      console.log("payload: ", vendorPayload);

      try {
        await dispatch(addVendorMutation(formData));
      } catch (error) {
        console.log("vendor-hook-submit-errors: ", error);
      }
      
      setSubmitting(false);
    },
  });

  // Handle server errors and map them to formik field errors
  useEffect(() => {
    if (vendorError) {
      const serverMessage = vendorError?.message;
      const serverErrors = vendorError?.errors || {};

      formik.setStatus({ serverError: serverMessage });

      if (serverErrors && typeof serverErrors === "object") {
        Object.entries(serverErrors).forEach(([key, value]) => {
          const firstMessage = Array.isArray(value)
            ? String(value[0])
            : String(value);

          const fieldMapping: any = {
            identityImage: "identityImageFile",
            licenseImage: "licenseImageFile",
            profileImage: "profileImageFile",
            coverImage: "coverImageFile",
            phone: "userPhone",
            email: "userEmail",
          };

          const mappedKey = fieldMapping[key] || key;
          
          if (mappedKey in formik.values) {
            formik.setFieldError(mappedKey, firstMessage);
          }
        });
      }

      setServerErrors(serverErrors);
      onError?.(vendorError);
    }
  }, [vendorError]);

  // Handle success
  useEffect(() => {
    if (vendorSuccess || vendorUpdatedSuccess) {
      onSuccess?.(vendorSuccess);
    }
  }, [vendorSuccess, vendorUpdatedSuccess]);

  const submit = useCallback(() => {
    console.log("Submit function called");
    console.log("Current formik state:", {
      values: formik.values,
      errors: formik.errors,
      touched: formik.touched,
      isValid: formik.isValid,
      isSubmitting: formik.isSubmitting,
    });

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
    formik.resetForm();
    setServerErrors(null);
    dispatch(clearVendorError());
  }, [formik, dispatch]);

  return {
    formik,
    submit,
    data: vendorSuccess,
    error: vendorError,
    isSuccess: !!(vendorSuccess || vendorUpdatedSuccess),
    isError: !!vendorError,
    isLoading: formik.isSubmitting,
    reset,
    setServerErrors,
  };
};