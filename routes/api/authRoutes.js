import express from "express";
import * as authController from "../../controllers/authController.js";
import { fileUploads } from "../../middleware/fileUploads.js";
import UploadFields from "../../util/UploadFields.js";
import { fieldNames, imageMimeTypes } from "../../util/const.js";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  fileUploads({
    maxSize: 5,
    acceptedTypes: imageMimeTypes,
  }).fields(UploadFields.getFields({ fieldName: fieldNames.REGISTER })),
  authController.postRegister
);

export default authRoutes;
