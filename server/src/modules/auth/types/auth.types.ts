import { Document, Types } from "mongoose";

export interface IAuthUser {
  email: string;
  hasOnboarded: boolean;
  refreshTokens: IRefreshToken[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IAuthUserDocument extends IAuthUser, Document {
  _id: Types.ObjectId;
}

export interface ITokenPayload {
  userId: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

// OTP request — just email
export interface IRequestOtpRequest {
  email: string;
}

// OTP response — returns JWT challenge token
export interface IRequestOtpResponse {
  success: boolean;
  message: string;
  otpToken?: string;
  data?: {
    otpToken: string;
  };
}

// OTP verification — email + the 6-digit code + the JWT challenge token
export interface IVerifyOtpRequest {
  email: string;
  otp: string;
  otpToken: string;
}

// Shape of decoded JWT challenge token
export interface IOtpTokenPayload {
  email: string;
  otpHash: string;
  iat?: number;
  exp?: number;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      hasOnboarded: boolean;
    };
    isNewUser: boolean;
  };
}

export interface ICurrentUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      hasOnboarded: boolean;
      isActive: boolean;
    };
  };
}
