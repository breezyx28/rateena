import React, { createContext, useContext, useEffect } from "react";
import { FormikProps } from "formik";

interface FormikErrorContextType {
  setServerErrors: (errors: any) => void;
}

const FormikErrorContext = createContext<FormikErrorContextType | null>(null);

interface FormikErrorProviderProps {
  children: React.ReactNode;
  formik: FormikProps<any>;
  serverError?: any;
}

export const FormikErrorProvider: React.FC<FormikErrorProviderProps> = ({
  children,
  formik,
  serverError,
}) => {
  const setServerErrors = (errors: any) => {
    if (errors) {
      const formikErrors: any = {};
      Object.keys(errors).forEach((key) => {
        if (Array.isArray(errors[key])) {
          formikErrors[key] = errors[key][0];
        } else {
          formikErrors[key] = errors[key];
        }
      });
      formik.setErrors(formikErrors);
    }
  };

  useEffect(() => {
    if (serverError?.errors) {
      setServerErrors(serverError.errors);
    }
  }, [serverError]);

  return (
    <FormikErrorContext.Provider value={{ setServerErrors }}>
      {children}
    </FormikErrorContext.Provider>
  );
};

export const useFormikError = () => {
  const context = useContext(FormikErrorContext);
  if (!context) {
    throw new Error("useFormikError must be used within FormikErrorProvider");
  }
  return context;
};