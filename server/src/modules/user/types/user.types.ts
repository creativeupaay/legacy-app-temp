import { Document, Types } from "mongoose";

export interface IUserProfile {
  authUser: Types.ObjectId;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileDocument extends IUserProfile, Document {
  _id: Types.ObjectId;
  fullName: string;
}

export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  data?: {
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      phone?: string;
      avatar?: string;
      email: string;
    };
  };
}
