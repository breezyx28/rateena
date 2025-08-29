import * as Yup from "yup";

export const vendorProductInitialValues = {
  name: "",
  ar_name: "",
  duration: "",
  company_profit: "",
  description: "",
  isFood: null,
  ar_description: "",
  quantity: "",
  price: "",
  category_id: "",
  options: [
    {
      name: "",
      fee: "",
      group_flag: "",
    },
  ],
};

export const VendorProductvalidationSchema = (): Yup.ObjectSchema<any> => {
  return Yup.object({
    name: Yup.string().required(),
    ar_name: Yup.string().required(),
    duration: Yup.string().required(),
    isFood: Yup.boolean().required(),
    company_profit: Yup.number()
      .typeError("Company profit should be number only")
      .min(1)
      .required(),
    description: Yup.string().nullable(),
    ar_description: Yup.string().nullable(),
    quantity: Yup.number()
      .typeError("Qunatity should be number only")
      .min(1)
      .required(),
    price: Yup.number()
      .typeError("Price should be number only")
      .min(1)
      .required(),
    category_id: Yup.number().required(),
    options: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        fee: Yup.number(),
        group_flag: Yup.string(),
      })
    ),
  }) as Yup.ObjectSchema<any>;
};

export const UpdateVendorProductvalidationSchema =
  (): Yup.ObjectSchema<any> => {
    return Yup.object({
      name: Yup.string(),
      arName: Yup.string(),
      duration: Yup.string(),
      isFood: Yup.boolean().required(),
      companyProfit: Yup.number()
        .typeError("Company profit should be number only")
        .min(1),
      description: Yup.string().nullable(),
      ar_description: Yup.string().nullable(),
      quantity: Yup.number().typeError("Qunatity should be number only").min(1),
      price: Yup.number().typeError("Price should be number only").min(1),
      categoryId: Yup.number(),
      // ✅ new mini form validation
      options: Yup.array().of(
        Yup.object().shape({
          name: Yup.string(),
          fee: Yup.number(),
          group_flag: Yup.string().nullable(),
        })
      ),
    }) as Yup.ObjectSchema<any>;
  };
