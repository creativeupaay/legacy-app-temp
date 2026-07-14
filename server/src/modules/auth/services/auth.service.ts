import AppError from "../../../utils/appError";
import AuthUser from "../models/authuser.model";
import {
  generateTokens,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils";
import {
  generateOtp,
  hashOtp,
  compareOtp,
  signOtpToken,
  verifyOtpToken,
} from "../utils/otp.utils";
import { IAuthUserDocument } from "../types/auth.types";

export const requestOtpService = async (email: string) => {
  const normalizedEmail = email.toLowerCase();
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const otpToken = signOtpToken(normalizedEmail, otpHash);

  // Temporary stand-in for email delivery — replace with email service later
  console.log(`[OTP] ${normalizedEmail} -> ${otp}`);

  return { otpToken };
};

export const verifyOtpService = async (email: string, otp: string, otpToken: string) => {
  const normalizedEmail = email.toLowerCase();

  let decoded;
  try {
    decoded = verifyOtpToken(otpToken);
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("OTP expired, request a new one", 401);
    }
    throw new AppError("Invalid or tampered OTP session", 401);
  }

  if (decoded.email !== normalizedEmail) {
    throw new AppError("Invalid OTP session", 401);
  }

  const isValid = await compareOtp(otp, decoded.otpHash);
  if (!isValid) {
    throw new AppError("Invalid OTP", 401);
  }

  // Find or create the AuthUser
  let user: IAuthUserDocument | null = await AuthUser.findOne({ email: normalizedEmail }).select("+refreshTokens");
  const isNewUser = !user || !user.hasOnboarded;

  if (!user) {
    await AuthUser.create({
      email: normalizedEmail,
      isVerified: true,
      lastActiveAt: new Date(),
    });
    // Re-fetch with refreshTokens selected
    user = await AuthUser.findOne({ email: normalizedEmail }).select("+refreshTokens");
  }

  if (!user) {
    throw new AppError("Failed to initialize user account", 500);
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated. Please contact support.", 403);
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Prune expired refresh tokens, append new one, and cap active sessions
  const now = new Date();
  let updatedTokens = (user.refreshTokens ?? [])
    .filter((rt) => rt.expiresAt > now)
    .concat({ token: refreshToken, createdAt: now, expiresAt: getRefreshTokenExpiry() });

  const MAX_ACTIVE_SESSIONS = 5;
  if (updatedTokens.length > MAX_ACTIVE_SESSIONS) {
    updatedTokens = updatedTokens
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_ACTIVE_SESSIONS);
  }

  await AuthUser.findByIdAndUpdate(user._id, {
    isVerified: true,
    lastActiveAt: now,
    refreshTokens: updatedTokens,
    "trigger.status": "not_triggered",
    "trigger.triggeredAt": null,
  });

  return { accessToken, refreshToken, user, isNewUser };
};

export const completeOnboardingService = async (userId: string) => {
  await AuthUser.findByIdAndUpdate(userId, { hasOnboarded: true });
};

export const refreshTokenService = async (refreshTokenFromCookie: string) => {
  const payload = verifyRefreshToken(refreshTokenFromCookie);
  if (!payload) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await AuthUser.findById(payload.userId).select("+refreshTokens");

  if (!user) {
    throw new AppError("User not found", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated", 403);
  }

  const tokenExists = user.refreshTokens.some(
    (rt) => rt.token === refreshTokenFromCookie && rt.expiresAt > new Date()
  );

  if (!tokenExists) {
    throw new AppError("Refresh token not found or expired", 401);
  }

  const now = new Date();
  const newAccessToken = generateAccessToken(user._id.toString());
  const newRefreshToken = generateRefreshToken(user._id.toString());

  let updatedTokens = (user.refreshTokens ?? [])
    .filter((rt) => rt.token !== refreshTokenFromCookie && rt.expiresAt > now)
    .concat({ token: newRefreshToken, createdAt: now, expiresAt: getRefreshTokenExpiry() });

  const MAX_ACTIVE_SESSIONS = 5;
  if (updatedTokens.length > MAX_ACTIVE_SESSIONS) {
    updatedTokens = updatedTokens
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_ACTIVE_SESSIONS);
  }

  await AuthUser.findByIdAndUpdate(user._id, {
    lastActiveAt: now,
    refreshTokens: updatedTokens,
    "trigger.status": "not_triggered",
    "trigger.triggeredAt": null,
  });

  return { newAccessToken, newRefreshToken };
};

export const logoutService = async (userId: string, refreshTokenFromCookie: string) => {
  const user = await AuthUser.findById(userId).select("+refreshTokens");
  if (user) {
    const now = new Date();
    user.refreshTokens = (user.refreshTokens ?? []).filter(
      (rt) => rt.token !== refreshTokenFromCookie && rt.expiresAt > now
    );
    await user.save();
  }
};

export const getCurrentUserService = async (userId: string) => {
  const user = await AuthUser.findById(userId);
  return user;
};
