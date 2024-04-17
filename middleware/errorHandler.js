import multer from "multer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { deleteUploadedFiles } from "./fileUploads.js";
import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (req.file) {
    deleteUploadedFiles({ file: [req.file] });
  } else if (req.files) {
    deleteUploadedFiles(
      Array.isArray(req.files) ? { file: req.files } : req.files
    );
  }
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  if (err instanceof ZodError) {
    return res
      .status(422)
      .json({ message: "Invalid data!", error: fromZodError(err) });
  } else if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
};

export default errorHandler;
