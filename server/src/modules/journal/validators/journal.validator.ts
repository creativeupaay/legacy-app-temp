import { z } from "zod";
import { EntryPrivacy } from "../types/journal.types";

export const createEntrySchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    textBody: z.string().trim().min(1, "Entry text is required").max(20000),
    privacy: z.nativeEnum(EntryPrivacy),
    sharedWith: z.array(z.string()).optional().default([]),
    entryDate: z.string().datetime().optional(),
    folderId: z.string().nullable().optional().default(null),
  })
  .refine(
    (data) =>
      data.privacy !== EntryPrivacy.SHARED_SPECIFIC ||
      (data.sharedWith && data.sharedWith.length > 0),
    {
      message:
        "sharedWith must include at least one contact when privacy is shared_specific",
      path: ["sharedWith"],
    }
  );

export const updateEntrySchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    textBody: z.string().trim().min(1).max(20000).optional(),
    privacy: z.nativeEnum(EntryPrivacy).optional(),
    sharedWith: z.array(z.string()).optional(),
    entryDate: z.string().datetime().optional(),
    folderId: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const listEntriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  privacy: z.nativeEnum(EntryPrivacy).optional(),
  folderId: z.string().nullable().optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type ListEntriesQuery = z.infer<typeof listEntriesQuerySchema>;
