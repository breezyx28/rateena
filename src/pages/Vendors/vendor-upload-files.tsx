import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Col, Row, Input } from "reactstrap";
import { useFormikContext } from "formik";
import { imgURL } from "services/api-handles";

type VendorUploadFilesProps = {
  files: {
    licenseImageFile: null;
    identityImageFile: null;
  };
  uploadedFiles: React.Dispatch<any>;
  defaultValues: { license: string | null; identity: string | null } | null;
};

const VendorUploadFiles: React.FC<VendorUploadFilesProps> = ({
  files,
  uploadedFiles,
  defaultValues,
}) => {
  const { errors } = useFormikContext<any>();
  const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);
  const [identityImageFile, setIdentityImageFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [identityPreview, setIdentityPreview] = useState<string | null>(null);

  // Set default images
  useEffect(() => {
    if (defaultValues?.license) {
      setLicensePreview(`${imgURL}/${defaultValues.license}`);
    }
    if (defaultValues?.identity) {
      setIdentityPreview(`${imgURL}/${defaultValues.identity}`);
    }
  }, [defaultValues]);

  // Update parent component when files change
  const updateUploadedFiles = useCallback(() => {
    uploadedFiles({
      licenseImageFile,
      identityImageFile,
    });
  }, [uploadedFiles, licenseImageFile, identityImageFile]);

  useEffect(() => {
    updateUploadedFiles();
  }, [licenseImageFile, identityImageFile, updateUploadedFiles]);

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseImageFile(file);
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdentityImageFile(file);
      setIdentityPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Row>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Upload License Image</h4>
          </CardHeader>
          <CardBody>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLicenseChange}
              className={`form-control ${
                errors.licenseImageFile ? "is-invalid" : ""
              }`}
            />
            {errors.licenseImageFile && (
              <div className="invalid-feedback d-block">
                {String(errors.licenseImageFile)}
              </div>
            )}
            {licensePreview && (
              <div className="mt-3">
                <img
                  src={licensePreview}
                  alt="License preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  className="img-thumbnail"
                />
              </div>
            )}
          </CardBody>
        </Card>
      </Col>

      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Upload UAE ID Image</h4>
          </CardHeader>
          <CardBody>
            <Input
              type="file"
              accept="image/*"
              onChange={handleIdentityChange}
              className={`form-control ${
                errors.identityImageFile ? "is-invalid" : ""
              }`}
            />
            {errors.identityImageFile && (
              <div className="invalid-feedback d-block">
                {String(errors.identityImageFile)}
              </div>
            )}
            {identityPreview && (
              <div className="mt-3">
                <img
                  src={identityPreview}
                  alt="Identity preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  className="img-thumbnail"
                />
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(VendorUploadFiles);
