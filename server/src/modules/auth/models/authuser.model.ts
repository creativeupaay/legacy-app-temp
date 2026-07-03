import mongoose, { Schema } from "mongoose";
import { IAuthUserDocument } from "../types/auth.types";

const RefreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const AuthUserSchema = new Schema<IAuthUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    hasOnboarded: {
      type: Boolean,
      default: false,
    },
    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AuthUser = mongoose.model<IAuthUserDocument>("AuthUser", AuthUserSchema);

export default AuthUser;
