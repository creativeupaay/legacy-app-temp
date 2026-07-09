import React from "react";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { Bell } from "@/components/ui/icons";
import { theme } from "@/theme/theme";
import { useGetProfileInsightsQuery } from "@/features/profile";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data: insightsResponse } = useGetProfileInsightsQuery();
  const streak = insightsResponse?.data?.insights?.streak || 0;

  return (
    <div className="flex items-center justify-between w-full">
      <StreakBadge 
        count={streak} 
        active={streak > 0} 
        onClick={() => navigate("/streak-calendar")}
      />
      
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0px_3px_1px_0px_rgba(0,0,0,0.04),0px_3px_8px_0px_rgba(0,0,0,0.12)] transition-transform active:scale-95"
        style={{ backgroundColor: theme.colors.surface.default }}
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={2} style={{ color: theme.colors.icon.primary }} />
      </button>
    </div>
  );
};

export default Header;
