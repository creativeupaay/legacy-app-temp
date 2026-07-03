import { baseApi } from "@/app/baseApi";
import type {
  IAuthResponse,
  ICurrentUserResponse,
  ILogoutRequest,
  IRequestOtpRequest,
  IRequestOtpResponse,
  IVerifyOtpRequest,
} from "../types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Request OTP — sends a 6-digit code and returns JWT challenge token
    requestOtp: builder.mutation<IRequestOtpResponse, IRequestOtpRequest>({
      query: (body) => ({
        url: "/auth/request-otp",
        method: "POST",
        body,
      }),
    }),

    // Verify OTP — authenticates (or creates) user statelessly, sets cookies
    verifyOtp: builder.mutation<IAuthResponse, IVerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Complete onboarding — sets hasOnboarded = true on the server
    completeOnboarding: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/complete-onboarding",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user — called by AuthWrapper on mount
    getCurrentUser: builder.query<ICurrentUserResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // Logout — clears cookies server-side
    logout: builder.mutation<{ success: boolean; message: string }, ILogoutRequest>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useCompleteOnboardingMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
