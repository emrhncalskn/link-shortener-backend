import { z } from "zod";

// User creation schema
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// User update schema
export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

// Get user by ID schema
export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
export type GetUserInput = z.TypeOf<typeof getUserSchema>;
