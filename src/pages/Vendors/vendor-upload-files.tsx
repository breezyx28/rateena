import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { imgURL } from "services/api-handles";

// Register the plugins once
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

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
  const [licenseImageFile, setLicenseImage] = useState<any>([]);
  const [identityImageFile, setIdentityImage] = useState<any>([]);

  // ✅ Precompute default file objects with useMemo
  const defaultLicense = useMemo(
    () =>
      defaultValues?.license
        ? [
            {
              source: `${imgURL}/${defaultValues.license}`,
              options: { type: "local" },
            },
          ]
        : [],
    [defaultValues?.license]
  );

  const defaultIdentity = useMemo(
    () =>
      defaultValues?.identity
        ? [
            {
              source: `${imgURL}/${defaultValues.identity}`,
              options: { type: "local" },
            },
          ]
        : [],
    [defaultValues?.identity]
  );

  // ✅ Initialize state whenever default values change
  useEffect(() => {
    setLicenseImage(defaultLicense);
    setIdentityImage(defaultIdentity);
  }, [defaultLicense, defaultIdentity]);

  // ✅ Callback for propagating uploaded files
  const updateUploadedFiles = useCallback(() => {
    uploadedFiles({
      licenseImageFile,
      identityImageFile,
    });
  }, [uploadedFiles, licenseImageFile, identityImageFile]);

  // Trigger update when files change
  useEffect(() => {
    updateUploadedFiles();
  }, [licenseImageFile, identityImageFile, updateUploadedFiles]);

  return (
    <Row>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Upload License Image</h4>
          </CardHeader>
          <CardBody>
            <FilePond
              files={licenseImageFile}
              onupdatefiles={setLicenseImage}
              allowMultiple={false}
              maxFiles={1}
              name="licenseImage"
              className="filepond filepond-input-multiple"
            />
          </CardBody>
        </Card>
      </Col>

      <Col lg={6}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Upload UAE ID Image</h4>
          </CardHeader>
          <CardBody>
            <FilePond
              files={identityImageFile}
              onupdatefiles={setIdentityImage}
              allowMultiple={false}
              maxFiles={1}
              name="identityImage"
              className="filepond filepond-input-multiple"
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(VendorUploadFiles);
