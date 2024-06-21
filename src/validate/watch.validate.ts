import { z } from "zod";

export const watchValidate = z.object({
  body: z.object({
    name: z.string().min(1),
    image: z.string().min(1),
    price: z.coerce.number().positive(),
    automatic: z.string().optional(),
    description: z.string().min(1),
    brand: z.string().min(1),
  }),
});
