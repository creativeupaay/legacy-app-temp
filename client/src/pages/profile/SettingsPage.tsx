import React, { useState } from "react";
import { theme } from "@/theme/theme";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Lock, Palette, LogOut, User as UserIcon, ChevronRight } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    {
      label: "Profile",
      icon: <UserIcon className="w-5 h-5 text-blue-600" />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      onClick: () => alert("Notifications settings placeholder. TODO: Implement notification preferences."),
    },
    {
      label: "Privacy",
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      onClick: () => alert("Privacy settings placeholder. TODO: Implement privacy preferences."),
    },
    {
      label: "Theme",
      icon: <Palette className="w-5 h-5 text-purple-600" />,
      onClick: () => alert("Theme settings placeholder. TODO: Implement dark mode toggle."),
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1
          style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.heading }}
          className="text-2xl font-extrabold tracking-tight"
        >
          Settings
        </h1>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.onClick}
            style={{
              backgroundColor: theme.colors.surface.default,
              borderColor: theme.colors.stroke.border,
            }}
            className="p-4 rounded-[18px] border shadow-xs flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-gray-50/80 active:scale-[0.99] select-none"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span
                style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
                className="text-base font-bold"
              >
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div
          onClick={() => setIsLogoutModalOpen(true)}
          style={{
            backgroundColor: theme.colors.surface.default,
            borderColor: theme.colors.error.border || "#FCA5A5",
          }}
          className="p-4 rounded-[18px] border shadow-xs flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-red-50/50 active:scale-[0.99] select-none group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span
              style={{ fontFamily: theme.fonts.heading }}
              className="text-base font-bold text-red-600"
            >
              Logout
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            style={{ backgroundColor: theme.colors.surface.default }}
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-1">
              <LogOut className="w-6 h-6" />
            </div>
            <h3
              style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
              className="text-lg font-bold"
            >
              Logout?
            </h3>
            <p style={{ color: theme.colors.text.secondary }} className="text-sm -mt-2">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex items-center gap-3 mt-4 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoading}
                style={{ color: theme.colors.text.secondary }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
