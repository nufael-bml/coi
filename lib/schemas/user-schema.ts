import { z } from "zod";

/* -------------------------------- User Schema -------------------------------- */
export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(50, "Name must be less than 50 characters.")
    .trim(),
  email: z
    .email("Please enter a valid email address.")
    .min(5)
    .max(100)
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Please enter a valid phone number.")
    .default(""),
  role: z
    .string()
    .min(2, "Role must be at least 2 characters.")
    .max(30)
    .default("User"),
  status: z.enum(["Active", "Inactive", "Suspended"]).default("Active"),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters.")
    .default("Unknown"),
  department: z
    .string()
    .max(100, "Department name too long.")
    .default("Unassigned"),
  bio: z
    .string()
    .max(500, "Bio must be under 500 characters.")
    .default(""),
  joinDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD).")
    .default(() => new Date().toISOString().split("T")[0]),
  avatar: z
    .url("Avatar must be a valid URL.")
    .default(""),
  access_level: z.coerce
    .number()
    .min(0, "Access level cannot be negative.")
    .max(20, "Access level cannot exceed 20.")
    .default(0),
});

/* -------------------------------- Update Schema -------------------------------- */
export const updateUserSchema = userSchema.extend({
  id: z.string().min(1, "User ID is required."),
});

/* -------------------------------- Types -------------------------------- */
export type UserSchema = typeof userSchema;
export type UserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
