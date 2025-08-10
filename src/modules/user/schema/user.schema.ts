import { z } from "zod";
import { ERROR_MESSAGES } from "../../../constants/error-messages.constant";

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, ERROR_MESSAGES.USERNAME_MIN_LENGTH).optional(),
    password: z.string().min(6, ERROR_MESSAGES.PASSWORD_MIN_LENGTH).optional(),
  }),
});

export type UpdateUserRequest = z.TypeOf<typeof updateUserSchema>;
