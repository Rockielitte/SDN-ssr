import { z } from "zod";

export const loginValidate = z.object({
  body: z.object({
    memberName: z.string().email({ message: "Invalid email address!" }),
    password: z
      .string()
      .min(2, { message: "Password must be at least 2 chars!" }),
  }),
});
