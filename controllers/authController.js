import asyncHandler from "express-async-handler";
import { deleteUploadedFiles } from "../middleware/fileUploads.js";
import { userSchema } from "../schemas/authValidation.js";

export const postRegister = asyncHandler(async (req, res) => {
  const { body, files } = req;
  req.body.profile = req.files?.profile;
  const validatedData = userSchema().parse(req.body);
  console.log(validatedData);
  deleteUploadedFiles(req.files);
  return res.status(200).json({ data: { body, files } });
});
