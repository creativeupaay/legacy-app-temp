import { baseApi } from "@/app/baseApi";
import type {
  IProfileResponse,
  IUpdateProfileRequest,
  IProfileInsightsResponse,
  IUploadImageResponse,
} from "../types/profile.types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my profile
    getMyProfile: builder.query<IProfileResponse, void>({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // Update my profile
    updateMyProfile: builder.mutation<IProfileResponse, IUpdateProfileRequest>({
      query: (data) => ({
        url: "/profile/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Upload profile image
    uploadProfileImage: builder.mutation<IUploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/profile/upload-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Get profile insights
    getProfileInsights: builder.query<IProfileInsightsResponse, void>({
      query: () => ({
        url: "/profile/insights",
        method: "GET",
      }),
      providesTags: ["Insights"],
    }),

    // Get profile by user ID
    getProfileByUserId: builder.query<IProfileResponse, string>({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
      ],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadProfileImageMutation,
  useGetProfileInsightsQuery,
  useGetProfileByUserIdQuery,
  useLazyGetProfileByUserIdQuery,
} = profileApi;
