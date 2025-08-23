import * as Yup from "yup";

export const vendorProductInitialValues = {
  name: "",
  arName: "",
  duration: "",
  companyProfit: "",
  description: "",
  arDescription: "",
  quantity: "",
  price: "",
  categoryId: "",
  images: [],
  options: [
    {
      opName: "",
      fee: "",
      groupFlag: "",
    },
  ],
};

export const VendorProductvalidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(),
    arName: Yup.string().required(),
    duration: Yup.string().required(),
    companyProfit: Yup.number()
      .typeError("Company profit should be number only")
      .min(1)
      .required(),
    description: Yup.string().nullable(),
    arDescription: Yup.string().nullable(),
    quantity: Yup.number()
      .typeError("Qunatity should be number only")
      .min(1)
      .required(),
    price: Yup.number()
      .typeError("Price should be number only")
      .min(1)
      .required(),
    categoryId: Yup.number().required(),
    images: Yup.mixed()
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
    // ✅ new mini form validation
    options: Yup.array().of(
      Yup.object().shape({
        opName: Yup.string().required("Option name is required"),
        fee: Yup.number().required("Fee is required"),
        groupFlag: Yup.string().required("Group flag is required"),
      })
    ),
  });
};
