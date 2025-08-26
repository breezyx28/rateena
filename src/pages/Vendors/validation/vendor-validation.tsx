import * as Yup from "yup";

export const supportedVendorType = [
  { id: 1, name: "Restaurant / مطعم", value: "RESTAURANT" },
  { id: 2, name: "Grocery / بقالة", value: "GROCERY" },
  { id: 3, name: "Store / متجر", value: "STORE" },
];

export const supportedRegions = [
  { id: 1, name: "Abu Dhabi / أبوظبي", value: "ABU_DHABI" },
  { id: 2, name: "Al-Ain / العين", value: "AL_AIN" },
  { id: 3, name: "Dubai / دبي", value: "DUBAI" },
  { id: 4, name: "Sharjah / الشارقة", value: "SHARJAH" },
  { id: 5, name: "Ajman / عجمان", value: "AJMAN" },
  { id: 6, name: "Umm Al-Quwain / أم القويين", value: "UMM_ALQUWAIN" },
  { id: 7, name: "Ras Al-Khaimah / رأس الخيمة", value: "RAS_ALKHAIMAH" },
  { id: 8, name: "Fujairah / الفجيرة", value: "FUJAIRAH" },
];

export const validationSchema = () => {
  return Yup.object({
    fullName: Yup.string().required(),
    arFullName: Yup.string().required(),
    lat: Yup.number().required(),
    lng: Yup.number().required(),
    phone: Yup.string()
      .matches(/^(009665|\+9665|05)\d{8}$/)
      .required(),
    password: Yup.string().min(8).required(),
    email: Yup.string().email().required(),
    maxKilometerDelivery: Yup.number().min(1).required(),
    closingTime: Yup.string()
      .matches(/^(\d{2}:\d{2}:\d{2})$/)
      .required(),
    openingTime: Yup.string()
      .matches(/^(\d{2}:\d{2}:\d{2})$/)
      .required(),
    minChargeLongDistance: Yup.number().min(1).required(),
    vendorType: Yup.string()
      .oneOf(supportedVendorType.map((type) => type.value))
      .required(),
    region: Yup.string()
      .oneOf(supportedRegions.map((region) => region.value))
      .required("Region is Required"),
    coverImage: Yup.mixed().notRequired(),
    profileImage: Yup.mixed().notRequired(),
    identityImage: Yup.mixed()
      .test(
        "fileSize",
        "حجم الصورة غير مدعوم",
        (value: any) => value && value.size <= 1024 * 1024 * 25 // 25 MB
      )
      .test(
        "fileType",
        `الملفات المدعومة png, jpg, jpeg, فقط`,
        (value: any) =>
          value && ["image/png", "image/jpg", "image/jpeg"].includes(value.type)
      ),
    licenseImage: Yup.mixed()
      .test(
        "fileSize",
        "حجم الصورة غير مدعوم",
        (value: any) => value && value.size <= 1024 * 1024 * 25 // 25 MB
      )
      .test(
        "fileType",
        `الملفات المدعومة png, jpg, jpeg, فقط`,
        (value: any) =>
          value && ["image/png", "image/jpg", "image/jpeg"].includes(value.type)
      ),
  });
};
