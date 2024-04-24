import mongoose from "mongoose";
import { z } from "zod";
import Service from "../models/Service.js";
import { paginationLimitSchema } from "./customSchemas.js";

export const professionalsFilterSchema = () =>
  z.object({
    service_type: z
      .string()
      .refine(
        async (val) => {
          if (mongoose.Types.ObjectId.isValid(val)) {
            const result = await Service.findOne({ _id: val }).lean();
            return !!result;
          }
          return false;
        },
        { message: "invalid service_type!" }
      )
      .transform((val) => {
        const _id = new mongoose.Types.ObjectId(val);
        return _id;
      }),
    limit: paginationLimitSchema,
    search: z.string().default(""),
    page: z.coerce.number().positive().gt(0),
  });
