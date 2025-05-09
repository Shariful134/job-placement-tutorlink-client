import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be  between 2 and 50 characters")
    .max(50, "First name must be  between 2 and 50 characters"),

  email: z
    .string({ required_error: "email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "password is required" })
    .min(6, "password must be 6 characters"),
  confirmPassword: z
    .string({ required_error: "confirm password is required" })
    .min(1),
});
