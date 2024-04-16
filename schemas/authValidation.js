import { z } from "zod";
import Service from "../models/Service.js";
import { imageSchema } from "./fileValidation.js";
import { customBooleanSchema } from "./customSchemas.js";

const userTypes = {
  CUSTOMER: "customer",
  VENDOR: "vendor",
  SPECIALIST: "specialist",
};
export const userTypeEnums = z.nativeEnum(userTypes);

export const userSchema = () => {
  return z
    .object({
      first_name: z.string().min(2),
      last_name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8).max(32),
      confirm_password: z.string().min(8).max(32),
      city: z.string().min(2),
      postcode: z.coerce.number().refine((val) => val.toString().length >= 4, {
        message: "postcode must contain at least 4 digits",
      }),
      phone: z.string().min(5),
      profile: z.array(imageSchema()).min(1, "profile is required"),
      user_type: userTypeEnums,
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"], // path of error
    });
};

const specialistFileSchema = {
  nid_picture: z
    .array(imageSchema())
    .min(2, "both sides of the nid_picture is required!"),
};

const vendorFileSchema = {
  company_reg_certicate: z
    .array(imageSchema())
    .min(1, "company_reg_certicate is required!"),
};

export const professionalSchema = (user_type) =>
  z.object({
    per_hour_rate: z.coerce.number().refine((val) => val >= 1, {
      message: "per_hour_rate must be greater than or equal to 1",
    }),
    ...(user_type === userTypeEnums.enum.SPECIALIST
      ? specialistFileSchema
      : vendorFileSchema),
    user_description: z.string().min(2),
    is_available_for_emergency: customBooleanSchema,
    interests: z
      .array(z.string())
      .min(1)
      .refine(
        async (val) => {
          const result = await Service.find({ _id: { $in: val } }).lean();
          return result.length === val.length;
        },
        {
          message: "invalid data!",
        }
      ),
  });
