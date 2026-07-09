import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(60, "Folder name cannot exceed 60 characters"),
  icon: z.string().trim().min(1, "Folder icon is required"),
  color: z.string().trim().min(1, "Folder color is required"),
});

export const updateFolderSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Folder name is required")
      .max(60, "Folder name cannot exceed 60 characters")
      .optional(),
    icon: z.string().trim().min(1).optional(),
    color: z.string().trim().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const deleteFolderSchema = z.object({
  action: z.enum(["move_to_all_entries", "move", "delete_all"]),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type DeleteFolderInput = z.infer<typeof deleteFolderSchema>;
