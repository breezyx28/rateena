import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Col, Row, Input } from "reactstrap";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { imgURL } from "services/api-handles";

type VendorUploadFilesProps = {
  files: {
    licenseImageFile: null;
    identityImageFile: null;
    profileImageFile: null;
    coverImageFile: null;
  };
  uploadedFiles: React.Dispatch<any>;
  defaultValues: {
    license: string | null;
    identity: string | null;
    profile: string | null;
    cover: string | null;
  } | null;
};

const VendorUploadFiles: React.FC<VendorUploadFilesProps> = ({
  files,
  uploadedFiles,
  defaultValues,
}) => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<any>();
  const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);
  const [identityImageFile, setIdentityImageFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [identityPreview, setIdentityPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Set default images
  useEffect(() => {
    if (defaultValues?.license) {
      setLicensePreview(`${imgURL}/${defaultValues.license}`);
    }
    if (defaultValues?.identity) {
      setIdentityPreview(`${imgURL}/${defaultValues.identity}`);
    }
    if (defaultValues?.cover) {
      setCoverPreview(`${imgURL}/${defaultValues.cover}`);
    }
    if (defaultValues?.profile) {
      setProfilePreview(`${imgURL}/${defaultValues.profile}`);
    }
  }, [defaultValues]);

  // Update parent component when files change
  const updateUploadedFiles = useCallback(() => {
    uploadedFiles({
      licenseImageFile,
      identityImageFile,
      profileImageFile,
      coverImageFile,
    });
  }, [
    uploadedFiles,
    licenseImageFile,
    identityImageFile,
    profileImageFile,
    coverImageFile,
  ]);

  useEffect(() => {
    updateUploadedFiles();
  }, [
    licenseImageFile,
    identityImageFile,
    profileImageFile,
    coverImageFile,
    updateUploadedFiles,
  ]);

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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Row>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">{t("Upload License Image")}</h4>
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
                  alt={t("License preview")}
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
            <h4 className="card-title mb-0">{t("Upload UAE ID Image")}</h4>
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
                  alt={t("Identity preview")}
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
            <h4 className="card-title mb-0">{t("Upload Profile Image")}</h4>
          </CardHeader>
          <CardBody>
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className={`form-control ${
                errors.profileImageFile ? "is-invalid" : ""
              }`}
            />
            {errors.profileImageFile && (
              <div className="invalid-feedback d-block">
                {String(errors.profileImageFile)}
              </div>
            )}
            {profilePreview && (
              <div className="mt-3">
                <img
                  src={profilePreview}
                  alt={t("Profile preview")}
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
            <h4 className="card-title mb-0">{t("Upload Cover Image")}</h4>
          </CardHeader>
          <CardBody>
            <Input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className={`form-control ${
                errors.coverImageFile ? "is-invalid" : ""
              }`}
            />
            {errors.coverImageFile && (
              <div className="invalid-feedback d-block">
                {String(errors.coverImageFile)}
              </div>
            )}
            {coverPreview && (
              <div className="mt-3">
                <img
                  src={coverPreview}
                  alt={t("Cover preview")}
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
