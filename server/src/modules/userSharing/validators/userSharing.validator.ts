import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  relationship: z.string().trim().max(50).optional(),
});

export const updateContactSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    relationship: z.string().trim().max(50).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
