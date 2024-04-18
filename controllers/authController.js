import bcrypt from "bcrypt";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Specialist from "../models/Specialist.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import {
  professionalSchema,
  resetPasswordVerificationSchema,
  userLoginSchema,
  userSchema,
  verifyAccountSchema,
  verifyOTPSchema,
} from "../schemas/authValidation.js";
import BadRequest from "../util/exceptions/BadRequest.js";
import Forbidden from "../util/exceptions/Forbidden.js";
import Unauthorized from "../util/exceptions/Unauthorized.js";
import {
  generateResetPasswordVerificationParams,
  generateVerifyAccountParams,
} from "../util/generateEmailParams.js";
import sendEmail from "../util/sendEmail.js";

export const postRegister = asyncHandler(async (req, res, next) => {
  req.body = { ...req.body, ...req.files };

  // request data validation
  const validatedUser = await userSchema().parseAsync(req.body);

  const professional = await professionalSchema(
    validatedUser.user_type
  ).parseAsync(req.body);

  // generate hashed password
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  validatedUser.password = await bcrypt.hash(validatedUser.password, salt);

  // transaction
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { user_type, confirm_password, ...user } = validatedUser;
      let vendor, specialist;

      // create professional if user_type matches & refer professional to user
      if (user_type === "vendor") {
        vendor = await Vendor.create([professional], { session });
        user.vendor = vendor[0]._id;
      } else if (user_type === "specialist") {
        specialist = await Specialist.create([professional], { session });
        user.specialist = specialist[0]._id;
      }

      // abort transaction if professional doesn't exist in user & user_type matches the following:
      if (user_type !== "customer" && !user.vendor && !user.specialist)
        throw new Error("Failed to register professional!");

      // create user
      let createdUser = await User.create([user], { session: session });
      createdUser = createdUser[0];

      // sends email to the user
      await sendEmail(generateVerifyAccountParams(createdUser));

      res.status(201).json({ data: createdUser });
    });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
});

export const verifyUserAccount = asyncHandler(async (req, res) => {
  // validation
  const { token, user_id } = verifyAccountSchema().parse(req.body);

  // fetch user
  const user = await User.findOne({
    _id: user_id,
    account_verify_token: token,
    account_verify_token_expiration: { $gte: new Date().getTime() },
  });

  // invalid link validation
  if (!user) throw new Forbidden("invalid link!");

  // otp validation
  const otp = verifyOTPSchema.parse(req.body.otp);
  if (user.otp !== otp) throw new BadRequest("invalid verification code!");

  // update verified status & verify-related data
  user.is_verified = true;
  user.account_verify_token = null;
  user.account_verify_token_expiration = null;
  user.otp = null;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "user verified successfully.",
    data: { user: updatedUser },
  });
});

export const postLogin = asyncHandler(async (req, res) => {
  const { email, password } = userLoginSchema().parse(req.body);

  const existingUser = await User.findOne({ email }).lean();
  if (!existingUser) throw new Unauthorized("invalid credentials!");

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) throw new Unauthorized("invalid credentials!");

  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );

  return res.status(200).json({ data: { user: existingUser, token } });
});

export const resetPasswordVerification = asyncHandler(async (req, res) => {
  const { email } = resetPasswordVerificationSchema(true).parse({
    email: req.body.email,
  });
  const user = await User.findOne({
    email,
  });

  // reset password expiration validate
  resetPasswordVerificationSchema().parse({
    email,
    reset_password_token: user.reset_password_token,
    reset_password_token_expiration: user.reset_password_token_expiration,
  });

  user.reset_password_token = crypto.randomBytes(32).toString("hex");
  user.reset_password_token_expiration =
    new Date().getTime() + Number(process.env.OTP_EXPIRATION);
  const updatedUser = await user.save();

  // sends email to the user
  await sendEmail(generateResetPasswordVerificationParams(updatedUser));

  return res.status(200).json({
    data: { user: updatedUser },
    message: "reset password verification email sent.",
  });
});
