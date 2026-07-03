import mongoose, { Schema } from "mongoose";
import { IUserProfileDocument } from "../types/user.types";

const UserProfileSchema = new Schema<IUserProfileDocument>(
  {
    authUser: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "Auth user reference is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        "Please provide a valid phone number",
      ],
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
UserProfileSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const UserProfile = mongoose.model<IUserProfileDocument>(
  "UserProfile",
  UserProfileSchema
);

export default UserProfile;
