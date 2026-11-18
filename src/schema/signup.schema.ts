import * as zod from "zod";
export let schema = zod
  .object({
    name: zod.string().min(6, "Name must be at least 6 characters long"),
    username: zod
      .string()
      .min(3, "Username must be at least 3 characters long"),
    email: zod.string().email("Invalid email address"),
    dateOfBirth: zod.coerce
      .date()
      .refine(
        (date) => date <= new Date(),
        "Date of birth must be in the past",
      ),
    gender: zod.enum(["male", "female"], "Please select your gender"),
    password: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    rePassword: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });
