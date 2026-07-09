import React from "react";
import { theme } from "@/theme/theme";
import { Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileSettingsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/profile/settings")}
      style={{
        backgroundColor: "#FFFFF9",
        borderWidth: "0.8px",
        borderStyle: "solid",
        borderColor: "#F9F9F3",
        borderRadius: "12px",
        boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.06)",
      }}
      className="w-full min-h-[52.6px] py-[14px] px-[16px] flex items-center justify-between cursor-pointer transition-all hover:bg-black/[0.02] active:bg-black/[0.04] select-none group gap-2"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1C1E] stroke-[1.8] shrink-0" />
        <span
          style={{ color: "#1C1C1E", fontFamily: theme.fonts.heading }}
          className="text-sm sm:text-[15px] font-semibold truncate"
        >
          Settings
        </span>
      </div>

      <ChevronRight className="w-4 h-4 text-[#C7C7CC] shrink-0 ml-1" />
    </div>
  );
};
