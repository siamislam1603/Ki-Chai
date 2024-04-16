import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Specialist from "../models/Specialist.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { professionalSchema, userSchema } from "../schemas/authValidation.js";
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

      // verify-token link creation & sends email to the user
      const url = `${process.env.FRONTEND_BASE_URL}/user/${createdUser._id}/verify/${createdUser.account_verify_token}`;
      await sendEmail({
        to: createdUser.email,
        subject: "Verify Account",
        text: url,
      });

      res.status(201).json({ data: createdUser });
    });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
});
