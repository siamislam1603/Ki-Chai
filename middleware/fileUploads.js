import fs from "fs";
import multer from "multer";
import path from "path";

// Function to handle multiple file uploads with dynamic field names
export const fileUploads = ({
  fieldBasedDestination = true,
  acceptedTypes,
  maxSize,
}) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        let dir = "./public/uploads";
        if (fieldBasedDestination) {
          dir += "/" + file.fieldname.split("[")[0];
        }
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        cb(null, dir.substring(dir.indexOf("/") + 1)); // Specify the destination directory
      },
      filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const fileName =
          file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") +
          "-" +
          Date.now() +
          fileExt;

        cb(null, fileName); // Use the original filename
      },
    }),
    limits: {
      fileSize: maxSize * 1024 * 1024, // Limit file size
    },
    fileFilter: function (req, file, cb) {
      if (acceptedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
      } else {
        cb(null, false);
      }
    },
  });

  return upload;
};

const deleteSingleFile = (file) => {
  if (file.destination && file.filename) {
    const filePath = file.destination + "/" + file.filename;
    if (filePath && fs.existsSync(filePath)) {
      console.log(filePath);
      fs.unlinkSync(filePath);
    }
  }
};

// Function to delete uploaded files
export const deleteUploadedFiles = (files) => {
  Object.values(files ?? {}).forEach((fileList) => {
    fileList.forEach((file) => {
      deleteSingleFile(file);
    });
  });
};

// file-path resolver
export const resolveFilePath = (file) => {
  const domain = process.env.BACKEND_DOMAIN;
  const filePath = file.destination + "/" + file.filename;
  return `${domain}/${filePath}`;
};