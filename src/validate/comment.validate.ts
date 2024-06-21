import { z } from "zod";

export const commentValidation = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(4),
  }),
});
