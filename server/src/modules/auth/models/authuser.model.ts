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
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    hasOnboarded: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
    trigger: {
      inactivityDays: { type: Number, default: 90 },
      status: {
        type: String,
        enum: ["not_triggered", "triggered"],
        default: "not_triggered",
      },
      triggeredAt: { type: Date, default: null },
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
