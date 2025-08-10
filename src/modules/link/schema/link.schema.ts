import { z } from "zod";

export const createLinkSchema = z.object({
  body: z.object({
    originalUrl: z
      .string()
      .url("Please provide a valid URL")
      .min(1, "URL is required"),
    customCode: z
      .string()
      .min(3, "Custom code must be at least 3 characters")
      .max(20, "Custom code must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "Custom code can only contain letters, numbers, hyphens and underscores"
      )
      .optional(),
  }),
});

export const redirectLinkSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required").max(20, "Slug is too long"),
  }),
});

export type CreateLinkRequest = z.TypeOf<typeof createLinkSchema>;
export type RedirectLinkRequest = z.TypeOf<typeof redirectLinkSchema>;
