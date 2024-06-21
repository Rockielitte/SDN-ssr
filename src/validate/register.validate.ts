import { z } from "zod";

export const registerValidate = z.object({
  body: z
    .object({
      name: z.string().min(3, { message: "Name must be at least 3 chars!" }),
      password: z
        .string()
        .min(2, { message: "Password must be at least 2 chars!" }),
      memberName: z.string().email({ message: "Invalid email address!" }),
      confirmPassword: z.string().min(2),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password must be the same!",
      path: ["confirmPassword"],
    }),
});
