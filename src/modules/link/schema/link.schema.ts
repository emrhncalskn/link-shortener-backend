import { z } from "zod";
import { ERROR_MESSAGES } from "../../../constants/error-messages.constant";

export const createLinkSchema = z.object({
  body: z.object({
    originalUrl: z
      .string()
      .url(ERROR_MESSAGES.INVALID_URL)
      .min(1, ERROR_MESSAGES.URL_REQUIRED),
    customCode: z
      .string()
      .min(3, ERROR_MESSAGES.CUSTOM_CODE_MIN_LENGTH)
      .max(20, ERROR_MESSAGES.CUSTOM_CODE_MAX_LENGTH)
      .regex(/^[a-zA-Z0-9-_]+$/, ERROR_MESSAGES.CUSTOM_CODE_INVALID_CHARS)
      .optional(),
  }),
});

export const redirectLinkSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .min(1, ERROR_MESSAGES.SLUG_REQUIRED)
      .max(20, ERROR_MESSAGES.SLUG_TOO_LONG),
  }),
});

export const updateLinkSchema = z.object({
  body: z.object({
    newShortCode: z
      .string()
      .min(3, ERROR_MESSAGES.NEW_SHORT_CODE_MIN_LENGTH)
      .max(20, ERROR_MESSAGES.NEW_SHORT_CODE_MAX_LENGTH)
      .regex(/^[a-zA-Z0-9-_]+$/, ERROR_MESSAGES.NEW_SHORT_CODE_INVALID_CHARS)
      .optional(),
  }),
  params: z.object({
    slug: z
      .string()
      .min(1, ERROR_MESSAGES.SLUG_REQUIRED)
      .max(20, ERROR_MESSAGES.SLUG_TOO_LONG),
  }),
});

export type CreateLinkRequest = z.TypeOf<typeof createLinkSchema>;
export type RedirectLinkRequest = z.TypeOf<typeof redirectLinkSchema>;
export type UpdateLinkRequest = z.TypeOf<typeof updateLinkSchema>;
