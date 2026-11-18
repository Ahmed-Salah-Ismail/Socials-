import * as zod from "zod";
export let loginSchema = zod.object({
  email: zod.string().email("Invalid email address"),

  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});
