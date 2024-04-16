import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { resolveFilePaths } from "../middleware/fileUploads.js";
import Specialist from "../models/Specialist.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { professionalSchema, userSchema } from "../schemas/authValidation.js";

export const postRegister = asyncHandler(async (req, res, next) => {
  req.body = { ...req.body, ...req.files };

  // validation
  const validatedUser = userSchema().parse(req.body);

  const professional = await professionalSchema(
    validatedUser.user_type
  ).parseAsync(req.body);

  // transaction
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { user_type, ...user } = validatedUser;
      let vendor, specialist;
      if (user_type === "vendor") {
        professional.company_reg_certicate = resolveFilePaths(
          professional.company_reg_certicate,
          false
        );

        vendor = await Vendor.create([professional], { session });
        user.vendor = vendor[0]._id;
      } else if (user_type === "specialist") {
        professional.nid_picture = resolveFilePaths(professional.nid_picture);

        specialist = await Specialist.create([professional], { session });
        user.specialist = specialist[0]._id;
      }

      if (user_type !== "customer" && !user.vendor && !user.specialist)
        throw new Error("Failed to register professional!");

      user.profile = resolveFilePaths(user.profile, false);
      const createdUser = await User.create([user], { session: session });
      res.status(200).json({ data: createdUser });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
});
