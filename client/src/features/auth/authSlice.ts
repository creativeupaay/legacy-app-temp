import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  IAuthState,
  IAuthUser,
  IAuthResponse,
  ICurrentUserResponse,
} from "./types/auth.types";
import { authApi } from "./api/authApi";

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isNewUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isNewUser = null;
    },
  },
  extraReducers: (builder) => {
    // OTP verification success — sets user + isNewUser flag
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, action: PayloadAction<IAuthResponse>) => {
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.isNewUser = action.payload.data.isNewUser;
        }
      }
    );

    // Onboarding complete — reflect hasOnboarded in local state
    builder.addMatcher(
      authApi.endpoints.completeOnboarding.matchFulfilled,
      (state) => {
        if (state.user) {
          state.user = { ...state.user, hasOnboarded: true };
          state.isNewUser = false;
        }
      }
    );

    // getCurrentUser success — hydrates state on page load
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action: PayloadAction<ICurrentUserResponse>) => {
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      }
    );

    // getCurrentUser pending — show loading while checking session
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );

    // getCurrentUser error — no active session
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    );

    // Logout success — clear everything
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isNewUser = null;
    });
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
