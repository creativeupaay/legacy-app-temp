import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string({ message: "Full name is required" })
    .trim()
    .min(1, "Full name cannot be empty")
    .max(100, "Full name cannot exceed 100 characters")
    .optional(),
  avatar: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
