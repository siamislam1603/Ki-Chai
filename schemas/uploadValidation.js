import { z } from "zod";
import { fieldNames } from "../util/const.js";
import { imageSchema } from "./fileValidation.js";

export const multipleFileUploadSchema = (req) => {
  const filesSchema = {};
  const fieldName = fieldNames.GYM_CLASS;
  Array.from(
    {
      length: req.body[fieldName]?.length ?? Object.keys(req.body.files).length,
    },
    (_, index) => {
      filesSchema[`${fieldName}[${index}][file]`] = z
        .array(imageSchema())
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
