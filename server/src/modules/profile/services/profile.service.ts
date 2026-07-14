import AuthUser from "../../auth/models/authuser.model";
import Journal from "../../journal/models/journal.model";
import UserSharing from "../../userSharing/models/userSharing.model";
import AppError from "../../../utils/appError";
import { EntryPrivacy } from "../../journal/types/journal.types";

export interface IProfileData {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
  inactivityDays?: number;
}

export interface IProfileInsights {
  memories: number;
  streak: number;
  longestStreak: number;
  activeDays: string[];
  recipients: number;
  sharedMemories: number;
}

export class ProfileService {
  /**
   * Get user profile by ID
   */
  public static async getProfile(userId: string): Promise<IProfileData> {
    const user = await AuthUser.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return {
      id: user._id.toString(),
      fullName: user.fullName || "",
      email: user.email,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
      inactivityDays: user.trigger?.inactivityDays ?? 90,
    };
  }

  /**
   * Update user profile
   */
  public static async updateProfile(
    userId: string,
    data: { fullName?: string; avatar?: string; inactivityDays?: number }
  ): Promise<IProfileData> {
    const updateFields: Record<string, any> = {};
    if (data.fullName !== undefined) updateFields.fullName = data.fullName;
    if (data.avatar !== undefined) updateFields.avatar = data.avatar;
    if (data.inactivityDays !== undefined) {
      updateFields["trigger.inactivityDays"] = data.inactivityDays;
    }

    const user = await AuthUser.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return {
      id: user._id.toString(),
      fullName: user.fullName || "",
      email: user.email,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
      inactivityDays: user.trigger?.inactivityDays ?? 90,
    };
  }

  /**
   * Calculate profile insights dynamically without storing counters
   */
  public static async getInsights(userId: string): Promise<IProfileInsights> {
    const [memories, recipients, sharedMemories, journalDates] =
      await Promise.all([
        Journal.countDocuments({ ownerId: userId }),
        UserSharing.countDocuments({ ownerId: userId }),
        Journal.countDocuments({
          ownerId: userId,
          privacy: { $ne: EntryPrivacy.PRIVATE },
        }),
        Journal.find({ ownerId: userId })
          .select("entryDate")
          .sort({ entryDate: -1 })
          .lean(),
      ]);

    // Calculate writing streak (consecutive days)
    let streak = 0;
    let longestStreak = 0;
    const activeDays: string[] = [];

    if (journalDates && journalDates.length > 0) {
      const uniqueDayStrings = Array.from(
        new Set(
          journalDates.map((doc: any) => {
            const d = new Date(doc.entryDate);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          })
        )
      ).sort((a, b) => (a < b ? 1 : -1)); // descending order YYYY-MM-DD

      activeDays.push(...uniqueDayStrings);

      // Calculate longest streak
      if (uniqueDayStrings.length > 0) {
        let currentLongest = 1;
        let tempStreak = 1;
        let prevDate = new Date(`${uniqueDayStrings[0]}T00:00:00Z`);

        for (let i = 1; i < uniqueDayStrings.length; i++) {
          const currDate = new Date(`${uniqueDayStrings[i]}T00:00:00Z`);
          const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
          if (tempStreak > currentLongest) currentLongest = tempStreak;
          prevDate = currDate;
        }
        longestStreak = currentLongest;
      }

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const yesterday = new Date(today.getTime() - 86400000);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

      // Check if streak is active (has entry today or yesterday)
      if (
        uniqueDayStrings[0] === todayStr ||
        uniqueDayStrings[0] === yesterdayStr
      ) {
        streak = 1;
        let currentDate = new Date(`${uniqueDayStrings[0]}T00:00:00Z`);
        for (let i = 1; i < uniqueDayStrings.length; i++) {
          const expectedPrevDate = new Date(
            currentDate.getTime() - 86400000
          );
          const expectedStr = `${expectedPrevDate.getUTCFullYear()}-${String(expectedPrevDate.getUTCMonth() + 1).padStart(2, "0")}-${String(expectedPrevDate.getUTCDate()).padStart(2, "0")}`;
          if (uniqueDayStrings[i] === expectedStr) {
            streak++;
            currentDate = expectedPrevDate;
          } else {
            break;
          }
        }
      }
    }

    return {
      memories,
      streak,
      longestStreak,
      activeDays,
      recipients,
      sharedMemories,
    };
  }
}
 
