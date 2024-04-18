import crypto from "crypto";
import mongoose from "mongoose";
import { z } from "zod";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { generateOTP } from "../util/const.js";
import { customBooleanSchema } from "./customSchemas.js";
import { imageSchema } from "./fileValidation.js";

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
      email: z
        .string()
        .email()
        .refine(
          async (val) => {
            const foundUser = await User.findOne({ email: val }).lean();
            if (foundUser) return false;
            return true;
          },
          { message: "email already exists!" }
        ),
      password: z.string().min(8).max(32),
      confirm_password: z.string().min(8).max(32),
      city: z.string().min(2),
      postcode: z.coerce.number().refine((val) => val.toString().length >= 4, {
        message: "postcode must contain at least 4 digits",
      }),
      phone: z
        .string()
        .min(5)
        .refine(
          async (val) => {
            const foundUser = await User.findOne({ phone: val }).lean();
            if (foundUser) return false;
            return true;
          },
          { message: "phone already exists!" }
        ),
      profile: z
        .array(imageSchema())
        .min(1, "profile is required")
        .transform((val) => val[0]),
      user_type: userTypeEnums,
      otp: z.number().default(generateOTP()),
      account_verify_token: z
        .string()
        .default(crypto.randomBytes(32).toString("hex")),
      account_verify_token_expiration: z
        .number()
        .default(new Date().getTime() + Number(process.env.OTP_EXPIRATION)),
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
    .min(1, "company_reg_certicate is required!")
    .transform((val) => val[0]),
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
      .superRefine(async (val, ctx) => {
        if ([...new Set(val)].length !== val.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "unique value must be provided",
            fatal: true,
          });

          return z.NEVER;
        }
        const result = await Service.find({ _id: { $in: val } }).lean();

        if (result.length !== val.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "invalid data!",
          });
        }
      }),
  });

export const verifyAccountSchema = () =>
  z.object({
    user_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    token: z.string().length(64),
  });

export const verifyOTPSchema = z.coerce
  .number({ invalid_type_error: "otp is required!" })
  .positive()
  .refine((val) => val.toString().length === 6, {
    message: "invalid otp!",
  });

export const userLoginSchema = () =>
  z.object({ email: z.string().email(), password: z.string().min(8).max(32) });

export const resetPasswordVerificationSchema = (isPartial = false) => {
  let validationSchema = z.object({
    email: z.string().email(),
    reset_password_token_expiration: z.number().nullish(),
    reset_password_token: z.string().nullish(),
  });
  if (isPartial) validationSchema = validationSchema.partial({ email: false });
  return validationSchema.refine(
    ({ reset_password_token_expiration, reset_password_token }) => {
      if (reset_password_token_expiration && reset_password_token) {
        if (new Date().getTime() <= reset_password_token_expiration)
          return false;
      }
      return true;
    },
    {
      message: "reset password verification email already sent!",
      path: ["email"], // path of error
    }
  );
};

export const resendVerifyAccountEmailSchema = (isPartial = false) => {
  let validationSchema = z.object({
    email: z.string().email(),
    account_verify_token_expiration: z.number().nullish(),
    account_verify_token: z.string().nullish(),
    otp: z.number().default(generateOTP()),
  });
  if (isPartial) validationSchema = validationSchema.partial({ email: false });
  return validationSchema.refine(
    ({ account_verify_token_expiration, account_verify_token }) => {
      if (account_verify_token_expiration && account_verify_token) {
        if (new Date().getTime() <= account_verify_token_expiration)
          return false;
      }
      return true;
    },
    {
      message: "account verification email already sent!",
      path: ["email"], // path of error
    }
  );
};
