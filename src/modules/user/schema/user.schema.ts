import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export type CreateUserRequest = z.TypeOf<typeof createUserSchema>;
export type UpdateUserRequest = z.TypeOf<typeof updateUserSchema>;
export type GetUserRequest = z.TypeOf<typeof getUserSchema>;
