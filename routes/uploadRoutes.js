import express from "express";
import * as uploadController from "../controllers/uploadController.js";
import { fileUploads } from "../middleware/fileUploads.js";
import UploadFields from "../util/UploadFields.js";
import { fieldNames, imageMimeTypes } from "../util/const.js";

const uploadRoutes = express.Router();

uploadRoutes.route("/multiple").post(
  fileUploads({
    maxSize: 5,
    acceptedTypes: imageMimeTypes,
  }).fields(UploadFields.getFields({ fieldName: fieldNames.GYM_CLASS })),
  uploadController.postFiles
);

export default uploadRoutes;
