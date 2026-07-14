// Profile Types

export interface IProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
  inactivityDays?: number;
}

export interface IUpdateProfileRequest {
  fullName?: string;
  avatar?: string | null;
  inactivityDays?: number;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  data?: {
    profile: IProfile;
  };
}

export interface IProfileInsights {
  memories: number;
  streak: number;
  longestStreak: number;
  activeDays: string[];
  recipients: number;
  sharedMemories: number;
}

export interface IProfileInsightsResponse {
  success: boolean;
  message: string;
  data?: {
    insights: IProfileInsights;
  };
}

export interface IUploadImageResponse {
  success: boolean;
  message: string;
  data: null;
}
