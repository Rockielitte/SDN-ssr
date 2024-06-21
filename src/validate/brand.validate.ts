import { z } from "zod";

export const brandValidate = z.object({
  body: z.object({
    brandName: z.string({
      message: "Brand name is required",
    }),
  }),
});
