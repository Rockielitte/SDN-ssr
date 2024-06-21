import { z } from "zod";

export const userValidation = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    memberName: z.string().min(1).max(255),
    isAdmin: z.boolean(),
  }),
});
