import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Button, Modal, ModalBody, ModalHeader, Alert } from "reactstrap";
import { AdvertisementsList } from "./AdvertisementsList";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { getAdvertisementsListQuery } from "slices/advertisements/thunk";
import Swal from "sweetalert2";
// Removed FilePond in favor of simple input uploader like add-product-modal
import { vendorsList } from "slices/thunks";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { useAdvertisementWithValidation } from "../../hooks/useAdvertisementWithValidation";
import { useAdvertisementsList } from "hooks";
import FieldError from "Components/Common/FieldError";
import AddAdvertisementModal from "./AddAdvertisementModal";

const Advertisements = () => {
  document.title = "Advertisements | Rateena - E-Shop Admin Panel";

  const { i18n, t } = useTranslation();
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const { data: adsData, fetchAdvertisements } = useAdvertisementsList();

  // Use the advertisement with validation hook
  const { formik, submit, data, error, isSuccess, isError, isLoading, reset } =
    useAdvertisementWithValidation({
      onSuccess: (data) => {
        Swal.fire({
          title: t("Advertisement added successfully"),
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setmodal_standard(false);
        reset();
        setSelectedFiles([]);
        // Refresh the advertisements list
        fetchAdvertisements();
      },
      onError: (error) => {
        console.log("Advertisement error:", error);
      },
    });

  React.useEffect(() => {
    fetchAdvertisements();
  }, []);

  const dispatch: any = useDispatch();

  // Vendor Reducer
  const selectVendorsLayoutState = (state: any) => state.Vendors;
  const selectVendorLayoutProperties = createSelector(
    selectVendorsLayoutState,
    (state) => ({
      vendorsListSuccess: state.vendorsListSuccess,
      vendorsError: state.vendorsError,
    })
  );

  // Inside your component
  const { vendorsError, vendorsListSuccess } = useSelector(
    selectVendorLayoutProperties
  );

  // Create vendor options for react-select
  const vendorOptions = useMemo(() => {
    if (!vendorsListSuccess?.list) return [];

    let list = vendorsListSuccess.list;

    if (formik.values.banner) {
      const banner = adsData?.data?.availableBanners?.find(
        (b: any) => b.banner_id == formik.values.banner
      );

      if (banner) {
        list = list.filter(
          (vendor: any) =>
            vendor.vendorType === banner.name ||
            (banner.name === "Restaurants" && vendor.vendorType === "مطاعم") ||
            (banner.name === "مطاعم" && vendor.vendorType === "RESTAURANT") ||
            (banner.name === "Restaurants" &&
              vendor.vendorType === "RESTAURANT") ||
            (banner.name === "Groceries" && vendor.vendorType === "بقالات") ||
            (banner.name === "بقالات" && vendor.vendorType === "GROCERY") ||
            (banner.name === "Groceries" && vendor.vendorType === "GROCERY") ||
            (banner.name === "Stores" && vendor.vendorType === "متاجر") ||
            (banner.name === "متاجر" && vendor.vendorType === "STORE") ||
            (banner.name === "Stores" && vendor.vendorType === "STORE")
        );
      }
    }

    return list.map((vendor: any) => ({
      value: vendor.vendorId,
      label: i18n.dir() === "rtl" ? vendor.arFullName : vendor.fullName,
    }));
  }, [
    vendorsListSuccess,
    i18n,
    formik.values.banner,
    adsData?.data?.availableBanners,
  ]);

  React.useEffect(() => {
    dispatch(getAdvertisementsListQuery());
    dispatch(vendorsList());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      formik.setFieldValue("adsImage1", files.length > 0 ? files[0] : null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFiles([]);
    formik.setFieldValue("adsImage1", null);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <div className="live-preview w-full d-flex justify-content-end">
                  <div>
                    <Button color="primary" onClick={() => tog_standard()}>
                      {t("Add Advertisement")}
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardHeader className="p-0 border-0 bg-light-subtle">
                    <Row className="g-0 text-center">
                      {adsData?.data?.availableBanners &&
                        adsData.data.availableBanners.map(
                          ({ name }: { name: string }, index: number) => (
                            <Col xs={6} sm={3} key={index}>
                              <div className="p-3">
                                <h5 className="mb-1">
                                  <span className={""}>
                                    {Number(index) + 1}
                                  </span>
                                </h5>
                                <p className="text-muted mb-0">
                                  {name ?? "---"}
                                </p>
                              </div>
                            </Col>
                          )
                        )}
                    </Row>
                  </CardHeader>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <AdvertisementsList
                        data={adsData?.data?.list ?? []}
                        vendorsListSuccess={vendorsListSuccess}
                        onRefresh={fetchAdvertisements}
                        availableBanners={adsData?.data?.availableBanners ?? []}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <AddAdvertisementModal
          isOpen={modal_standard}
          toggle={tog_standard}
          formik={formik}
          submit={submit}
          error={error}
          isLoading={isLoading}
          vendorOptions={vendorOptions}
          adsData={adsData}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleFileChange={handleFileChange}
          removeSelectedFile={removeSelectedFile}
        />
        {/* <ToastContainer autoClose={2000} limit={1} /> */}
      </div>
    </React.Fragment>
  );
};

export default Advertisements;
