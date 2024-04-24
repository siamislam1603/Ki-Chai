import { z } from "zod";
import { paginationLimits } from "../util/const.js";

export const customBooleanSchema = z
  .enum(["0", "1", "true", "false"])
  .transform((value) => value == "true" || value == "1");

export const paginationLimitSchema = z.coerce
  .number()
  .positive()
  .gt(0)
  .refine((val) => paginationLimits.includes(val), {
    message: `page limits can only be one of these: (${paginationLimits.join(
      ", "
    )})`,
  });
