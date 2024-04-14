import { z } from "zod";
import { fieldNames, imageMimeTypes } from "../util/const.js";

const imageSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine(
    (val) => imageMimeTypes.includes(val),
    () => ({
      message: `Only ${getMimeTypeValidationMsg(
        imageMimeTypes
      )} format allowed!`,
    })
  ),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(5242880, "File size must be less than 5MB"),
});

export const multipleFileUploadSchema = (req) => {
  const filesSchema = {};
  const fieldName = fieldNames.GYM_CLASS;
  Array.from(
    {
      length: req.body[fieldName]?.length ?? Object.keys(req.body.files).length,
    },
    (_, index) => {
      filesSchema[`${fieldName}[${index}][file]`] = z
        .array(imageSchema)
        .min(1, "At least one file must be uploaded!");
      return;
    }
  );
  return z.object({
    gym_classes: z.array(
      z.object({
        name: z.string().min(2),
      })
    ),
    files: z.object(filesSchema),
  });
};
