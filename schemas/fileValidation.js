import { z } from "zod";
import { getMimeTypeValidationMsg, imageMimeTypes } from "../util/const.js";
import { resolveFilePath } from "../middleware/fileUploads.js";

export const imageSchema = (validTypes = imageMimeTypes) =>
  z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine(
        (val) => validTypes.includes(val),
        () => ({
          message: `Only ${getMimeTypeValidationMsg(
            validTypes
          )} format allowed!`,
        })
      ),
      destination: z.string(),
      filename: z.string(),
      path: z.string(),
      size: z.number().max(5242880, "File size must be less than 5MB"),
    })
    .transform((val) => resolveFilePath(val));
