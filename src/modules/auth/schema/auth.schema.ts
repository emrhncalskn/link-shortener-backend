import { z } from "zod";
import { ERROR_MESSAGES } from "../../../constants/error-messages.constant";

export const registerDto = z.object({
  body: z.object({
    username: z.string().min(3, ERROR_MESSAGES.USERNAME_MIN_LENGTH),
    password: z.string().min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH),
  }),
});

export const loginDto = z.object({
  body: z.object({
    username: z.string().min(3, ERROR_MESSAGES.USERNAME_MIN_LENGTH),
    password: z.string().min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH),
  }),
});

export type RegisterDto = z.TypeOf<typeof registerDto>;
export type LoginDto = z.TypeOf<typeof loginDto>;
