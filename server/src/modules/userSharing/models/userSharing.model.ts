import mongoose, { Schema } from "mongoose";
import { IUserSharingDocument } from "../types/userSharing.types";

const UserSharingSchema = new Schema<IUserSharingDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "Owner is required"],
      index: true,
    },
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "Recipient user reference is required"],
    },
    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [50, "Relationship cannot exceed 50 characters"],
    },
  },
  { timestamps: true }
);

// Prevent the same owner adding the same contact email twice
UserSharingSchema.index({ ownerId: 1, email: 1 }, { unique: true });

const UserSharing = mongoose.model<IUserSharingDocument>(
  "UserSharing",
  UserSharingSchema
);
export default UserSharing;
