import { z } from "zod";

export const passwordValidation = z.object({
  body: z
    .object({
      password: z.string().min(2).max(20),
      newPassword: z.string().min(2).max(20),
      confirmPassword: z.string().min(2).max(20),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "new password and confirm password must be the same",
      path: ["confirmPassword"],
    }),
});
