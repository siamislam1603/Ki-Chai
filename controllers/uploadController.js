import asyncHandler from "express-async-handler";
import { multipleFileUploadSchema } from "../schemas/uploadValidation.js";

export const postFiles = asyncHandler(async (req, res) => {
  req.body.files = req.files;
  // VALIDATION
  const validatedData = multipleFileUploadSchema(req).parse(req.body);
  console.log(validatedData);
  res.send("Multiple files uploaded successfully");
});
