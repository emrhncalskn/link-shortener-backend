import { z } from "zod";
export const registerDto = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
export const loginDto = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  }),
});

export type RegisterDto = z.TypeOf<typeof registerDto>;
export type LoginDto = z.TypeOf<typeof loginDto>;
