import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import { ProfileService } from "../services/profile.service";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Not authorized", 401);
  }

  const profile = await ProfileService.getProfile(userId);

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: {
      profile,
    },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Not authorized", 401);
  }

  const profile = await ProfileService.updateProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      profile,
    },
  });
});

export const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Not authorized", 401);
  }

  if (!req.file) {
    throw new AppError("No image file provided", 400);
  }

  // TODO: Replace this placeholder implementation with AWS S3 upload after storage integration.

  res.status(200).json({
    success: true,
    message: "Profile image upload endpoint ready. AWS S3 integration pending.",
    data: null,
  });
});

export const getProfileInsights = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Not authorized", 401);
  }

  const insights = await ProfileService.getInsights(userId);

  res.status(200).json({
    success: true,
    message: "Profile insights fetched successfully",
    data: {
      insights,
    },
  });
});
