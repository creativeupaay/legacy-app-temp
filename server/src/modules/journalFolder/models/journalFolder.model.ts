import mongoose, { Schema } from "mongoose";
import { IJournalFolderDocument } from "../types/journalFolder.types";

const JournalFolderSchema = new Schema<IJournalFolderDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "Owner is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: [60, "Folder name cannot exceed 60 characters"],
    },
    icon: {
      type: String,
      required: [true, "Folder icon is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Folder color is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound unique index on (ownerId, name) with case-insensitive collation
JournalFolderSchema.index(
  { ownerId: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const JournalFolder = mongoose.model<IJournalFolderDocument>(
  "JournalFolder",
  JournalFolderSchema
);

export default JournalFolder;
