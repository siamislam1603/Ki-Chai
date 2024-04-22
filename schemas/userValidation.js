import mongoose from "mongoose";
import { z } from "zod";
import Service from "../models/Service.js";

export const professionalsFilterSchema = () =>
  z.object({
    service_type: z.string().refine(
      async (val) => {
        if (mongoose.Types.ObjectId.isValid(val)) {
          const result = await Service.findOne({ _id: val }).lean();
          return !!result;
        }
        return false;
      },
      { message: "invalid service_type!" }
    ),
    city: z.string().min(2),
    postcode: z.coerce.number().refine((val) => val.toString().length >= 4, {
      message: "postcode must contain at least 4 digits",
    }),
    expire_at: z.coerce.date(),
  });
