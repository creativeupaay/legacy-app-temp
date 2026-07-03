// Auth User
export interface IAuthUser {
  id: string;
  email: string;
  hasOnboarded: boolean;
  isActive?: boolean;
}

// OTP request — email only
export interface IRequestOtpRequest {
  email: string;
}

// OTP request response — returns JWT challenge token
export interface IRequestOtpResponse {
  success: boolean;
  message: string;
  otpToken?: string;
  data?: {
    otpToken: string;
  };
}

// OTP verification — email + otp + JWT challenge token
export interface IVerifyOtpRequest {
  email: string;
  otp: string;
  otpToken: string;
}

// Logout — empty body (cookie sent automatically)
export interface ILogoutRequest {}

// Refresh — empty body (cookie sent automatically)
export interface IRefreshTokenRequest {}

// Auth response — from verifyOtp
export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: IAuthUser;
    isNewUser: boolean;
  };
}

// Current user response — from /me
export interface ICurrentUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: IAuthUser;
  };
}

// Redux auth state
export interface IAuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean | null;
}

// Route types for AuthWrapper
export type RouteType = "public" | "private";

export interface IAuthWrapperProps {
  children: React.ReactNode;
  routeType: RouteType;
  redirectPath: string;
}
