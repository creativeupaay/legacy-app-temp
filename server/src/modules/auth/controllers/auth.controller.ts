import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import {
  COOKIE_NAMES,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "../utils/jwt.utils";
import { RequestOtpInput, VerifyOtpInput } from "../validators/auth.validator";
import {
  requestOtpService,
  verifyOtpService,
  completeOnboardingService,
  refreshTokenService,
  logoutService,
  getCurrentUserService,
} from "../services/auth.service";

/**
 * @desc    Request OTP — generates code, signs challenge JWT, sends plaintext via console
 * @route   POST /api/v1/auth/request-otp
 * @access  Public
 */
export const requestOtp = asyncHandler(async (req: Request<{}, {}, RequestOtpInput>, res: Response) => {
  const { email } = req.body;
  const { otpToken } = await requestOtpService(email);

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

  const { accessToken, refreshToken, user, isNewUser } = await verifyOtpService(email, otp, otpToken);

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
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401);
    }

    await completeOnboardingService(req.user.userId);

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

    const { newAccessToken, newRefreshToken } = await refreshTokenService(refreshTokenFromCookie);

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
    await logoutService(req.user.userId, refreshTokenFromCookie);
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
    // req.user is guaranteed by protect() middleware
    const user = await getCurrentUserService(req.user!.userId);

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
