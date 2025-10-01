import React from "react";

type FieldErrorProps = {
  formik: any;
  name: string; // supports nested names e.g., "address.city"
  className?: string;
};

function getIn(object: any, path: string) {
  return path
    .split(".")
    .reduce((acc: any, key: string) => (acc == null ? acc : acc[key]), object);
}

const FieldError: React.FC<FieldErrorProps> = ({
  formik,
  name,
  className = "invalid-feedback d-block",
}) => {
  const touched = getIn(formik?.touched, name);
  const error = getIn(formik?.errors, name);
  if (!touched || !error) return null;
  return <div className={className}>{String(error)}</div>;
};

export default FieldError;
