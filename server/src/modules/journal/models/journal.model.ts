import mongoose, { Schema } from "mongoose";
import { IJournalEntryDocument, EntryPrivacy } from "../types/journal.types";

const JournalSchema = new Schema<IJournalEntryDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser", // matches existing model name used by modules/auth
      required: [true, "Owner is required"],
      index: true, // every query filters by owner, index this
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    textBody: {
      type: String,
      required: [true, "Entry text is required"],
      trim: true,
      maxlength: [20000, "Entry cannot exceed 20,000 characters"],
    },
    privacy: {
      type: String,
      enum: Object.values(EntryPrivacy),
      default: EntryPrivacy.PRIVATE,
      required: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserSharing",
      },
    ],
    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Common list-view query pattern: owner's entries, newest first
JournalSchema.index({ ownerId: 1, entryDate: -1 });

const Journal = mongoose.model<IJournalEntryDocument>("Journal", JournalSchema);
export default Journal;
