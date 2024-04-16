import { z } from "zod";

export const customBooleanSchema = z
  .enum(["0", "1", "true", "false"])
  .transform((value) => value == "true" || value == "1");
