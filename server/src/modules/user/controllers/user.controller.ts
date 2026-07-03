import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import UserProfile from "../models/user.model";
import AuthUser from "../../auth/models/authuser.model";
import { IUpdateProfileRequest } from "../types/user.types";

/**
 * @desc    Get current user's profile
 * @route   GET /api/v1/profile/me
 * @access  Private (Superadmin)
 */
export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await UserProfile.findOne({
      authUser: req.user?.userId,
    }).populate("authUser", "email");

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const authUser = profile.authUser as any;

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        profile: {
          id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName: profile.fullName,
          phone: profile.phone,
          avatar: profile.avatar,
          email: authUser?.email,
        },
      },
    });
  }
);

/**
 * @desc    Create or update profile
 * @route   PUT /api/v1/profile/me
 * @access  Private (Superadmin)
 */
export const updateMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, phone, avatar } =
      req.body as IUpdateProfileRequest;

    // Check if auth user exists
    const authUser = await AuthUser.findById(req.user?.userId);
    if (!authUser) {
      throw new AppError("User not found", 404);
    }

    // Find existing profile or create new one
    let profile = await UserProfile.findOne({
      authUser: req.user?.userId,
    });

    if (profile) {
      // Update existing profile
      if (firstName) profile.firstName = firstName;
      if (lastName) profile.lastName = lastName;
      if (phone !== undefined) profile.phone = phone;
      if (avatar !== undefined) profile.avatar = avatar;

      await profile.save();
    } else {
      // Create new profile - firstName and lastName required
      if (!firstName || !lastName) {
        throw new AppError(
          "First name and last name are required for new profile",
          400
        );
      }

      profile = await UserProfile.create({
        authUser: req.user?.userId,
        firstName,
        lastName,
        phone,
        avatar,
      });
    }

    res.status(200).json({
      success: true,
      message: profile.isNew
        ? "Profile created successfully"
        : "Profile updated successfully",
      data: {
        profile: {
          id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName: profile.fullName,
          phone: profile.phone,
          avatar: profile.avatar,
          email: authUser.email,
        },
      },
    });
  }
);

/**
 * @desc    Get profile by user ID (Admin use)
 * @route   GET /api/v1/profile/:userId
 * @access  Private (Superadmin)
 */
export const getProfileByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const profile = await UserProfile.findOne({
      authUser: userId,
    }).populate("authUser", "email");

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const authUser = profile.authUser as any;

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        profile: {
          id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName: profile.fullName,
          phone: profile.phone,
          avatar: profile.avatar,
          email: authUser?.email,
        },
      },
    });
  }
);
