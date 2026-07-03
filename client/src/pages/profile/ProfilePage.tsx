import React from "react";
import { useAppSelector } from "@/app/hooks";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { theme } from "@/theme/theme";

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <h1
        style={{ color: theme.colors.text.primary }}
        className="text-2xl font-bold"
      >
        Profile
      </h1>

      <div
        style={{
          backgroundColor: theme.colors.surface.default,
          borderColor: theme.colors.stroke.border,
        }}
        className="p-6 rounded-2xl border shadow-xs flex items-center gap-4"
      >
        <div
          style={{
            backgroundColor: theme.colors.primary.action,
            color: theme.colors.text.inverse,
          }}
          className="w-14 h-14 rounded-full text-xl font-bold flex items-center justify-center shrink-0"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p
            style={{ color: theme.colors.text.muted }}
            className="text-xs font-medium uppercase tracking-wider"
          >
            Signed in as
          </p>
          <p
            style={{ color: theme.colors.text.primary }}
            className="text-base font-semibold truncate"
          >
            {user?.email || "User"}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.error.bg,
            color: theme.colors.error.textDark,
            borderColor: theme.colors.error.border,
          }}
          className="w-full border rounded-xl py-3 px-4 font-semibold text-sm transition-opacity hover:opacity-80 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
