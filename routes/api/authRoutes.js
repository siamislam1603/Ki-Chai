import express from "express";
import multer from "multer";
import * as authController from "../../controllers/authController.js";
import { fileUploads } from "../../middleware/fileUploads.js";
import UploadFields from "../../util/UploadFields.js";
import { fieldNames, imageMimeTypes } from "../../util/const.js";

const authRoutes = express.Router();
const upload = multer();

authRoutes.post(
  "/register",
  fileUploads({
    maxSize: 5,
    acceptedTypes: imageMimeTypes,
  }).fields(UploadFields.getFields({ fieldName: fieldNames.REGISTER })),
  authController.postRegister
);

authRoutes.post(
  "/verify-account",
  upload.none(),
  authController.verifyUserAccount
);

export default authRoutes;
