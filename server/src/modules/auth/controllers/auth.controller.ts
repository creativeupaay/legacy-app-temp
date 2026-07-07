import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import AuthUser from "../models/authuser.model";
import {
  generateTokens,
  verifyRefreshToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  COOKIE_NAMES,
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
import { RequestOtpInput, VerifyOtpInput } from "../validators/auth.validator";

/**
 * @desc    Request OTP — generates code, signs challenge JWT, sends plaintext via console
 * @route   POST /api/v1/auth/request-otp
 * @access  Public
 */
export const requestOtp = asyncHandler(async (req: Request<{}, {}, RequestOtpInput>, res: Response) => {
  const { email } = req.body;

  const normalizedEmail = email.toLowerCase();
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const otpToken = signOtpToken(normalizedEmail, otpHash);

  // Temporary stand-in for email delivery — replace with email service later
  console.log(`[OTP] ${normalizedEmail} -> ${otp}`);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    otpToken,
    data: {
      otpToken,
    },
  });
});

/**
 * @desc    Verify OTP — authenticates user statelessly via JWT challenge
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = asyncHandler(async (req: Request<{}, {}, VerifyOtpInput>, res: Response) => {
  const { email, otp, otpToken } = req.body;

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
  });

  // Set httpOnly cookies
  res.cookie(COOKIE_NAMES.accessToken, accessToken, getAccessTokenCookieOptions());
  res.cookie(COOKIE_NAMES.refreshToken, refreshToken, getRefreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: isNewUser ? "Account created successfully" : "Login successful",
    data: {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName || "",
        avatar: user.avatar || null,
        hasOnboarded: user.hasOnboarded,
      },
      isNewUser,
    },
  });
});

/**
 * @desc    Complete onboarding — sets hasOnboarded = true
 * @route   POST /api/v1/auth/complete-onboarding
 * @access  Private
 */
export const completeOnboarding = asyncHandler(
  async (req: Request, res: Response) => {
    await AuthUser.findByIdAndUpdate(req.user!.userId, { hasOnboarded: true });

    res.status(200).json({
      success: true,
      message: "Onboarding complete",
    });
  }
);

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public (requires refresh token cookie)
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshTokenFromCookie = req.cookies[COOKIE_NAMES.refreshToken];

    if (!refreshTokenFromCookie) {
      throw new AppError("Refresh token not found", 401);
    }

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
    });

    res.cookie(COOKIE_NAMES.accessToken, newAccessToken, getAccessTokenCookieOptions());
    res.cookie(COOKIE_NAMES.refreshToken, newRefreshToken, getRefreshTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  }
);

/**
 * @desc    Logout
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies[COOKIE_NAMES.refreshToken];

  if (req.user?.userId) {
    const user = await AuthUser.findById(req.user.userId).select("+refreshTokens");
    if (user) {
      const now = new Date();
      user.refreshTokens = (user.refreshTokens ?? []).filter(
        (rt) => rt.token !== refreshTokenFromCookie && rt.expiresAt > now
      );
      await user.save();
    }
  }

  res.clearCookie(COOKIE_NAMES.accessToken, { path: "/" });
  res.clearCookie(COOKIE_NAMES.refreshToken, { path: "/" });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      res.status(200).json({
        success: true,
        message: "No active session",
        data: { user: null },
      });
      return;
    }

    const user = await AuthUser.findById(req.user.userId);

    if (!user) {
      res.status(200).json({
        success: true,
        message: "No active session",
        data: { user: null },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName || "",
          avatar: user.avatar || null,
          hasOnboarded: user.hasOnboarded,
          isActive: user.isActive,
        },
      },
    });
  }
);
