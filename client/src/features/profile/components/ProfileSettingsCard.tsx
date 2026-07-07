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
        border: "0.8px solid #AAC8DB",
        borderRadius: "12px",
        boxShadow: "1px 1px 3px rgba(0,0,0,0.06)",
      }}
      className="w-full py-3 sm:py-3.5 px-3.5 sm:px-4 md:px-5 flex items-center justify-between cursor-pointer transition-all hover:bg-black/[0.02] active:bg-black/[0.04] select-none group gap-2"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1C1E] stroke-[1.8] shrink-0 group-hover:rotate-45 transition-transform duration-300" />
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
